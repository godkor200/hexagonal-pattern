import { Module, Provider } from '@nestjs/common';
import { GetLessonAvailableInfoHttpController } from './queries/Get-lesson-available-info/get-lesson-available-info.http.controller';
import { EntityModule } from './database/entitity/entity.module';
import {
  COACH_REPOSITORY,
  CUSTOMERS_REPOSITORY,
  DEL_LESSON,
  GET_LESSON_INFO,
  GET_LESSON_INFO_LIST,
  LESSON_REPOSITORY,
  POST_LESSON,
  PUT_LESSON,
} from './constants/lesson.di-token';
import { GetLessonAvailableInfoQueryHandler } from './queries/Get-lesson-available-info/get-lesson-available-info.query-handler';
import { CoachesRepository } from './database/repository/coaches.repository';
import { LessonRepository } from './database/repository/lesson.repository';
import { ReqLessonHttpController } from './command/req-lesson/req-lesson.http.controller';
import { ReqLessonCommandHandler } from './command/req-lesson/req-lesson.command-handler';
import { CustomersRepository } from './database/repository/customers.repository';
import { GetLessonInfoQueryHandler } from './queries/Get-lesson-info/get-lesson-info.query-handler';
import { GetLessonInfoHttpController } from './queries/Get-lesson-info/get-lesson-info.http.controller';
import { PutLessonInfoHttpController } from './command/put-lesson-info/put-lesson-info.http.controller';
import { PutLessonInfoCommandHandler } from './command/put-lesson-info/put-lesson-info.command-handler';
import { DeleteLessonCommandHandler } from './command/delete-lesson/delete-lesson.command-handler';
import { DeleteLessonHttpController } from './command/delete-lesson/delete-lesson.http.controller';

const queryHandlers: Provider[] = [
  {
    provide: GET_LESSON_INFO_LIST,
    useClass: GetLessonAvailableInfoQueryHandler,
  },
  {
    provide: GET_LESSON_INFO,
    useClass: GetLessonInfoQueryHandler,
  },
];

const commandHandlers: Provider[] = [
  {
    provide: POST_LESSON,
    useClass: ReqLessonCommandHandler,
  },
  {
    provide: PUT_LESSON,
    useClass: PutLessonInfoCommandHandler,
  },
  {
    provide: DEL_LESSON,
    useClass: DeleteLessonCommandHandler,
  },
];

const repositories: Provider[] = [
  { provide: COACH_REPOSITORY, useClass: CoachesRepository },
  { provide: LESSON_REPOSITORY, useClass: LessonRepository },
  {
    provide: CUSTOMERS_REPOSITORY,
    useClass: CustomersRepository,
  },
];

@Module({
  imports: [EntityModule],
  controllers: [
    GetLessonAvailableInfoHttpController,
    PutLessonInfoHttpController,
    GetLessonInfoHttpController,
    ReqLessonHttpController,
    DeleteLessonHttpController,
  ],
  providers: [...queryHandlers, ...repositories, ...commandHandlers],
})
export class LessonsModule {}
