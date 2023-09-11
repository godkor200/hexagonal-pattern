import { GetLessonInfoInboundPortInputDto } from '../../interface/get-lesson-info.interface';
import { LessonEntity } from '../../database/entitity/lesson.entity';
import {
  PutLessonInfoInboundPort,
  PutLessonInfoInboundPortInputDto,
  PutLessonInfoInboundPortQueryParams,
} from '../../interface/put-lesson-info.interface';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  COACH_REPOSITORY,
  CUSTOMERS_REPOSITORY,
  LESSON_REPOSITORY,
} from '../../constants/lesson.di-token';
import { CustomersRepositoryPort } from '../../database/repository/customers.repository.port';
import { LessonRepositoryPort } from '../../database/repository/lesson.repository.port';
import { LessonNumber } from '../../interface/get-lesson-available-info.interface';
import { CoachesRepository } from '../../database/repository/coaches.repository';
import { CoachesRepositoryPort } from '../../database/repository/coaches.repository.port';

export class PutLessonInfoCommandHandler implements PutLessonInfoInboundPort {
  constructor(
    @Inject(CUSTOMERS_REPOSITORY)
    protected readonly customersRepository: CustomersRepositoryPort,

    @Inject(LESSON_REPOSITORY)
    protected readonly lessonRepository: LessonRepositoryPort,

    @Inject(COACH_REPOSITORY)
    protected readonly coachRepository: CoachesRepositoryPort,
  ) {}
  async execute(
    query: PutLessonInfoInboundPortQueryParams,
    body: PutLessonInfoInboundPortInputDto,
  ): Promise<Boolean> {
    const {
      customerName,
      phoneNumber,
      coachName,
      timesPerWeek,
      lessonTimes,
      endTime,
    } = body;
    const userLesson = await this.customersRepository.getCustomerAndLessons(
      query,
    );

    if (!userLesson) {
      throw new HttpException(
        {
          message: '사용자를 찾을수 없습니다',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (userLesson[0].lessonType == LessonNumber.TRIAL) {
      throw new HttpException(
        {
          message: '정기 레슨이 아닙니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const coach = await this.coachRepository.findOneByCoachName(coachName);

    if (!coach) {
      throw new HttpException(
        {
          message: '코치를 찾을수 없습니다',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const idx = userLesson.map((e) => e.id);
    try {
      return await this.customersRepository.transaction(async () => {
        const res =
          await this.customersRepository.putCustomerNameAndPhoneNumber({
            ...query,
            phoneNumber,
            customerName,
          });
        return await this.lessonRepository.putLessonInfo({
          idx,
          coachId: coach.id.toString(),
          timesPerWeek,
          lessonTimes,
          endTime,
        });
      });
    } catch (err) {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
