/**
 * API 1 : 레슨 가능 일정 정보 받기
 * - 코치 이름(김민준, 오서준, 이도윤, 박예준) coacheName
 * - 1회 레슨/정기 레슨 lessonType
 * - 주 1회/2회/3회 (정기 레슨 시) lessonNumber
 * - 레슨 소요 시간 30분/1시간 lessonTime
 * 위의 조건에 맞는 레슨 가능 시간 리스트를 반환합니다.
 * 레슨 가능 시간 리스트는 다음날부터 7일이면 됩니다.
 * 응답값 예시
 * {
 * “success”: true,
 * “data”: [‘2023-06-20 18:00:00’, ‘2023-06-20 18:30:00’, ...]
 * }
 */
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { GET_LESSON_INFO_LIST } from '../../constants/lesson.di-token';
import {
  GetLessonAvailableInfoInboundPort,
  GetLessonAvailableInfoInboundPortInputDto,
} from '../../interface/get-lesson-available-info.interface';
import { TRes } from '../../interface/res.types';
@Controller('lesson')
export class GetLessonAvailableInfoHttpController {
  constructor(
    @Inject(GET_LESSON_INFO_LIST)
    private readonly getLessonAvailableInfoInboundPort: GetLessonAvailableInfoInboundPort,
  ) {}

  @Get()
  async execute(
    @Query() query: GetLessonAvailableInfoInboundPortInputDto,
  ): Promise<TRes> {
    const res = await this.getLessonAvailableInfoInboundPort.execute(query);
    return {
      success: true,
      data: res,
    };
  }
}
