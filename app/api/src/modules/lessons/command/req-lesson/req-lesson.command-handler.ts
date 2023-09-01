import {
  ReqLessonInboundPort,
  ReqLessonInboundPortInputDto,
  ReqLessonResData,
} from '../../interface/req-lesson.interface';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMERS_REPOSITORY,
  COACH_REPOSITORY,
  LESSON_REPOSITORY,
} from '../../constants/lesson.di-token';
import { CustomersRepositoryPort } from '../../database/repository/customers.repository.port';
import { CoachesRepositoryPort } from '../../database/repository/coaches.repository.port';
import { LessonRepositoryPort } from '../../database/repository/lesson.repository.port';
import { LessonNumber } from '../../interface/get-lesson-available-info.interface';
import { LessonEntity } from '../../database/entitity/lesson.entity';
import { getDayOfWeek, generateIdOrPw } from '../../helpers/lesson.helpers';

// Assuming start_time is a string in the format 'YYYY-MM-DD HH:mm:ss'

@Injectable()
export class ReqLessonCommandHandler implements ReqLessonInboundPort {
  constructor(
    @Inject(CUSTOMERS_REPOSITORY)
    protected readonly customersRepository: CustomersRepositoryPort,
    @Inject(COACH_REPOSITORY)
    protected readonly coachRepository: CoachesRepositoryPort,
    @Inject(LESSON_REPOSITORY)
    protected readonly lessonRepository: LessonRepositoryPort,
  ) {}

  async execute(body: ReqLessonInboundPortInputDto): Promise<ReqLessonResData> {
    try {
      const { isRegularLesson } = body;

      const coach = await this.coachRepository.findOneByCoachName(
        body.coachName,
      );

      if (!coach) {
        throw new HttpException(
          {
            message: '그 코치는 속해 있지 않습니다.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const lessonAllList = await this.lessonRepository.findAll();

      const lessonListByCoach = lessonAllList.filter(
        (lesson) => lesson.coachId == coach.id,
      );

      let lessonType = this.getLessonType(isRegularLesson, body.timesPerWeek);

      if (isRegularLesson) {
        // Regular lessons collision check
        this.checkCollisionForRegularLessons(
          lessonListByCoach,
          body.lessonTimes,
        );
      } else {
        // One-time lessons collision check
        this.checkCollisionForOneTimeLessons(
          lessonListByCoach,
          body.lessonTimes[0],
        );
      }

      // Generate username and password
      const username = generateIdOrPw(10);
      const password = generateIdOrPw(15);

      // Insert new customer into the database
      const customerId = await this.customersRepository.insertCustomer({
        username,
        password,
        customerName: body.customerName,
        phoneNumber: body.phoneNumber,
      });

      // Insert new lessons into the database
      await Promise.all(
        body.lessonTimes.map(async (times) => {
          return await this.lessonRepository.insert({
            lessonType: lessonType,
            customerId,
            coachId: coach.id,
            courtId: this.assignCourt(lessonAllList, times),
            startTime: times,
            dayOfweek: getDayOfWeek(times.toString().replace('T', ' ')),
            endTime: body.endTime,
          });
        }),
      );

      return {
        id: username,
        password,
      };
    } catch (err) {
      console.log(err);
    }
  }

  // Helper method to determine the lesson type
  getLessonType(isRegularLesson: Boolean, timesPerWeek: number) {
    if (isRegularLesson) {
      switch (timesPerWeek) {
        case 3:
          return LessonNumber.THRICE;
        case 2:
          return LessonNumber.TWICE;
        default:
          return LessonNumber.ONCE;
      }
    } else {
      return LessonNumber.ONCE;
    }
  }

  // Collision check for regular lessons
  checkCollisionForRegularLessons(
    lessonListByCoach: LessonEntity[],
    lessonTimes: Date[],
  ) {
    for (let lesson of lessonListByCoach) {
      if (!lesson.isCancelled) {
        let lessonDay = new Date(lesson.startTime).getDay();
        let lessonHour = new Date(lesson.startTime).getHours();

        for (let time of lessonTimes) {
          let timeDay = new Date(time).getDay();
          let timeHour = new Date(time).getHours();

          if (timeDay === lessonDay && timeHour === lessonHour) {
            throw this.createCollisionError(time);
          }
        }
      }
    }
  }

  // Collision check for one-time lessons
  checkCollisionForOneTimeLessons(
    lessonListByCoach: LessonEntity[],
    startTime: Date,
  ) {
    let newLessonStartTime = new Date(startTime);

    for (let lesson of lessonListByCoach) {
      if (
        !lesson.isCancelled &&
        newLessonStartTime.getTime() === new Date(lesson.startTime).getTime()
      ) {
        throw this.createCollisionError(startTime);
      }
    }
  }

  createCollisionError(time: Date) {
    return new HttpException(
      { message: 'Collision detected at ' + time },
      HttpStatus.CONFLICT,
    );
  }

  /**
   * 전체 레슨을 불러와 어느 코트에 배정할지 출력, 주중은 모든 코트 주말은 1-3로 예상
   * @param lessons
   * @param newLessonTime
   */
  assignCourt(lessons: LessonEntity[], newLessonTime: Date) {
    // 요일을 확인하여 주말 여부 판단
    const convertDate = newLessonTime.toISOString().replace('T', ' ');
    const dayOfWeek = getDayOfWeek(convertDate);
    const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
    // 주말에는 1-3번 코트만 사용 가능, 평일에는 1-5번 코트 사용 가능
    const maxCourtNumber = isWeekend ? 3 : 5;

    for (let courtNumber = 1; courtNumber <= maxCourtNumber; courtNumber++) {
      let isCourtAvailable = true;
      let newLessonDateTime = new Date(convertDate);
      for (let lesson of lessons) {
        //취소되지 않았으며 현재 검사 중인 코트에서 진행되는 레슨
        if (!lesson.isCancelled && lesson.courtId === courtNumber) {
          let existingLessonStartTime = new Date(lesson.startTime);

          // 정기 레슨은 항상 그 요일에 있으므로 배제
          if (
            lesson.lessonType !== 'trial' &&
            lesson.dayOfweek === dayOfWeek &&
            existingLessonStartTime.getHours() +
              existingLessonStartTime.getMinutes() ==
              newLessonDateTime.getHours() + newLessonDateTime.getMinutes()
          ) {
            isCourtAvailable = false;
            break;
          }

          // 만약 레슨 시작 시간이 동일하다면 이 코트는 사용할 수 없음

          if (
            lesson.lessonType == 'trial' &&
            existingLessonStartTime.getTime() === newLessonDateTime.getTime()
          ) {
            isCourtAvailable = false;
            break;
          }
        }
      }

      // 해당 시간에 이용 가능한 코트를 찾았다면 반환
      if (isCourtAvailable) return courtNumber;

      // 모든 코트가 이미 예약되어 있으면 에러 발생
    }
    throw new HttpException(
      {
        message: 'No courts are available at this time',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
