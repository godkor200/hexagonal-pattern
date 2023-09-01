import { Body, Controller, Inject, Put, Query } from '@nestjs/common';
import { TRes } from '../../interface/res.types';
import { PUT_LESSON } from '../../constants/lesson.di-token';
import { ReqLessonInboundPort } from '../../interface/req-lesson.interface';
import {
  PutLessonInfoInboundPort,
  PutLessonInfoInboundPortInputDto,
  PutLessonInfoInboundPortQueryParams,
} from '../../interface/put-lesson-info.interface';

/**
 * API 4 : 레슨 수정하기
 * - 레슨 id와 password로 레슨 정보를 수정합니다.
 * - 정기 레슨만 수정이 가능합니다.
 * - 고객 이름, 고객 전화번호, 코치 이름, 주 몇회(정기레슨 시), 요일+시간 리스트, 소요 시간 - 위의 정보를 수정합니다.
 * - 신청 성공시에
 * {
 * “success”: true,
 * }- 신청 실패 시에
 * {
 * “success”: false,
 * “message”: “실패사유" }
 */
@Controller('lesson')
export class PutLessonInfoHttpController {
  constructor(
    @Inject(PUT_LESSON)
    protected readonly putLessonInfoInboundPort: PutLessonInfoInboundPort,
  ) {}

  @Put()
  async execute(
    @Query() query: PutLessonInfoInboundPortQueryParams,
    @Body() body: PutLessonInfoInboundPortInputDto,
  ): Promise<TRes> {
    const res = await this.putLessonInfoInboundPort.execute(query, body);
    if (res)
      return {
        success: true,
      };
  }
}
