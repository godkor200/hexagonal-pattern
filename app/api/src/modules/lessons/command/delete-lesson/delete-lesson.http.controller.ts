import { Controller, Inject, Param, Query, Delete } from '@nestjs/common';
import { DEL_LESSON } from '../../constants/lesson.di-token';
import { DelLessonInboundPort } from '../../interface/del-lesson.interface';
import { TRes } from '../../interface/res.types';

@Controller('lesson')
export class DeleteLessonHttpController {
  constructor(
    @Inject(DEL_LESSON)
    protected readonly delLessonInboundPort: DelLessonInboundPort,
  ) {}
  @Delete(':lessonId')
  async execute(
    @Param('lessonId') lessonId: string,
    @Query('password') password: string,
  ): Promise<TRes> {
    const res = await this.delLessonInboundPort.execute({ lessonId, password });
    if (res) {
      return {
        success: true,
      };
    }
  }
}
