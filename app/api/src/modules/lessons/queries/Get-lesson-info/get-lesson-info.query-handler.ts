import { Inject } from '@nestjs/common';
import {
  Coache,
  GetLessonInfoInboundPortInputDto,
} from '../../interface/get-lesson-info.inbound.port';
import {
  GET_COACHES_INFO,
  GET_LESSON_LIST,
} from '../../constants/lesson.di-token';
import { CoachesRepositoryPort } from '../../database/repository/coaches.repository.port';
import { LessonRepositoryPort } from '../../database/repository/lesson.repository.port';
import { LessonEntity } from '../../database/entitity/lesson.entity';

/**
 * - 레슨의 신청
 * - 레슨 시작은 월요일부터 일요일까지 오전 7시부터 오후 11시까지 가능합니다.
 * - 고객은 1대1 레슨만 신청할 수 있습니다.
 * - 레슨은 주 1회, 2회, 3회 레슨이 있습니다.
 * - 레슨은 30분 혹은 1시간 레슨이 있습니다.
 * - 고객은 1회 레슨(체험 레슨)만 받을 수도 있고 정기 레슨을 할 수도 있습니다. 1회 레슨만 받을 시에는 한번만
 * 받고 레슨은 종료되고 정기 레슨을 하는 경우에는 고객이 레슨을 취소하지 않을 때 까지 레슨은 지속 됩니다.
 * 예를 들면. 화 10시 30분, 목 15시에 30분씩 레슨으로 신청하면 매주 화, 목 해당 시간에 레슨을 하고 30분
 * 뒤에 종료됩니다.
 * - 레슨 사이에 쉬는 시간은 없습니다.
 * - 정기레슨은 다음날부터 레슨을 시작할 수 있습니다. 만약 오늘이 6월 20일이라면 6월 21일부터 정기레슨을
 * 시작할 수 있습니다.
 * - 1회 레슨은 다음날부터 7일 이내에만 가능합니다. 만약 오늘이 6월 20일이라면 6월 21일부터 6월 27일까지
 * 1회 레슨을 신청할 수 있습니다. 1회 레슨의 당일 예약은 불가능합니다.
 * - 1회 레슨을 받는 시간/코치의 정기 레슨의 신청은 불가능합니다. 예를 들면 김민준 코치가 6월 23일 금요일 13
 * 시에 1회 레슨 일정이 있다면 김민준 코치의 금요일 13시 정기레슨 신청은 불가능합니다.
 * - 정기 레슨은 다음날부터 레슨이 시작됩니다. 만약 오늘이 6월 20일(화)이라면 6월 21일(수)부터 정기레슨은
 * 시작합니다. 예를 들어 화, 목 10시 30분 시작 30분 레슨이라면 6월 22일 목요일 10시 30분부터 레슨이 시
 * 작됩니다.
 */

function generateDateTimeSlots(lessons: LessonEntity[], lessonLength: string) {
  const dates = [];
  const startDate = new Date();

  startDate.setDate(startDate.getDate() + 1); // 오늘로부터 하루 뒤인 내일 날짜 설정
  startDate.setHours(7, 0, 0, 0); // 시작 시간을 오전 7시로 설정

  for (let i = 0; i < 7; i++) {
    // 일주일 동안에 대해
    for (let j = 0; j < (23 - 7 + 1) * (60 / Number(lessonLength)); j++) {
      // 하루의 각 반시간 슬롯에 대해
      let newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + i);
      newDate.setMinutes(newDate.getMinutes() + j * Number(lessonLength)); // 반시간 간격으로 시간 추가

      let strNewDate = newDate.toISOString().replace('T', ' ').substring(0, 19);

      if (!isTimeSlotOccupied(strNewDate, lessons)) {
        dates.push(strNewDate);
        // ISO string에서 T를 공백으로 대체하고 초단위 이후는 제거하여 yyyy-mm-dd hh:mm:ss 형식으로 변환
      }
    }
  }

  return dates;
}

function isTimeSlotOccupied(timeSlotStr: string, lessons: LessonEntity[]) {
  let timeSlot = new Date(timeSlotStr);

  for (let lesson of lessons) {
    let startTime = new Date(lesson.startTime);
    let endTime = new Date(startTime.getTime());

    if (lesson.endTime === '1hour') {
      endTime.setMinutes(endTime.getMinutes() + 60);
    } else if (lesson.endTime === '30min') {
      endTime.setMinutes(endTime.getMinutes() + 30);
    }

    if (timeSlot >= startTime && timeSlot < endTime) return true;
  }

  return false;
}
export class GetLessonInfoQueryHandler {
  constructor(
    @Inject(GET_COACHES_INFO)
    protected readonly coachRepository: CoachesRepositoryPort,
    @Inject(GET_LESSON_LIST)
    protected readonly lessonRepository: LessonRepositoryPort,
  ) {}
  async execute(query: GetLessonInfoInboundPortInputDto): Promise<string[]> {
    const coach = await this.coachRepository.findOneByCoachName(
      query.coacheName,
    );

    const lessonList = await this.lessonRepository.findAllByCoachId(coach.id);

    return generateDateTimeSlots(lessonList, query.lessonTime);
  }
}
