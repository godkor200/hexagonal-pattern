import { Controller, Get, Inject, Query } from '@nestjs/common';
import { TRes } from '../../interface/res.types';
import {
  GetLessonInfoInboundPortInputDto,
  GetLessonInfoInboundPort,
} from '../../interface/get-lesson-info.interface';
import { GET_LESSON_INFO } from '../../constants/lesson.di-token';

@Controller('lesson')
export class GetLessonInfoHttpController {
  constructor(
    @Inject(GET_LESSON_INFO)
    private readonly getLessonInfoInboundPort: GetLessonInfoInboundPort,
  ) {}

  @Get('info')
  async execute(
    @Query() query: GetLessonInfoInboundPortInputDto,
  ): Promise<TRes> {
    return {
      success: true,
      data: await this.getLessonInfoInboundPort.execute(query),
    };
  }
}
