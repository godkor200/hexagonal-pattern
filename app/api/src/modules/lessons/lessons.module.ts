import { Module, Provider } from '@nestjs/common';
import { GetLessonInfoHttpController } from './queries/Get-lesson-info/get-lesson-info.http.controller';
import { EntityModule } from './database/entitity/entity.module';
import {
  GET_COACHES_INFO,
  GET_LESSON_INFO_LIST,
  GET_LESSON_LIST,
} from './constants/lesson.di-token';
import { GetLessonInfoQueryHandler } from './queries/Get-lesson-info/get-lesson-info.query-handler';
import { CoachesRepository } from './database/repository/coaches.repository';
import { LessonRepository } from './database/repository/lesson.repository';

const queryHandlers: Provider[] = [
  {
    provide: GET_LESSON_INFO_LIST,
    useClass: GetLessonInfoQueryHandler,
  },
];

const repositories: Provider[] = [
  { provide: GET_COACHES_INFO, useClass: CoachesRepository },
  { provide: GET_LESSON_LIST, useClass: LessonRepository },
];

@Module({
  imports: [EntityModule],
  controllers: [GetLessonInfoHttpController],
  providers: [...queryHandlers, ...repositories],
})
export class LessonsModule {}
