import { TRes } from '../../interface/res.types';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ReqLessonInboundPort,
  ReqLessonInboundPortInputDto,
} from '../../interface/req-lesson.interface';
import { POST_LESSON } from '../../constants/lesson.di-token';

/**
 * API 2 : 레슨 신청하기
 * - 고객 이름, 고객 전화번호, 코치 이름, 1회 레슨 혹은 정기레슨 선택, 주 몇회(정기레슨 시), 요일+시간 리스트, 소
 * 요 시간
 * - 위의 정보로 레슨을 신청합니다.
 * - 신청 성공시에 레슨 id, password(수정, 삭제를 위한), 레슨 시작 날짜를 데이터로 받습니다.
 * 응답값 예시(성공)
 * {
 * “success”: true,
 * “data”: {
 * id: “...”,
 * password: “...”
 * }
 * }
 * 레슨 아이디와 패스워드는 고객이 레슨 정보를 수정하고 삭제할 때 필요합니다.
 * 응답값 예시(실패)
 * {
 * “success”: false,
 * “message”: “실패사유”
 * }
 * message는 가공하지 않고 고객에게 보여질 예정입니다.
 */
@Controller('lesson')
export class ReqLessonHttpController {
  constructor(
    @Inject(POST_LESSON)
    protected readonly postLessonInfoInboundPort: ReqLessonInboundPort,
  ) {}

  @Post()
  async execute(@Body() body: ReqLessonInboundPortInputDto): Promise<TRes> {
    return {
      success: true,
      data: await this.postLessonInfoInboundPort.execute(body),
    };
  }
}
