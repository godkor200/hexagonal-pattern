import { LessonEntity } from '../database/entitity/lesson.entity';
import { IUserDao } from './get-lesson-info.interface';
import {
  ICustomerDao,
  ReqLessonInboundPortInputDto,
} from './req-lesson.interface';

export interface PutLessonInfoInboundPortQueryParams extends IUserDao {}

export interface IPutLessonInfo
  extends Omit<
    ReqLessonInboundPortInputDto,
    'customerName' | 'phoneNumber' | 'coachName' | 'isRegularLesson'
  > {
  idx: number[];
  coachId: string;
}

export interface ICustomerChangeDao extends ICustomerDao {}
export interface PutLessonInfoInboundPortInputDto
  extends Omit<ReqLessonInboundPortInputDto, 'isRegularLesson'> {}

export interface PutLessonInfoInboundPort {
  execute(
    query: PutLessonInfoInboundPortQueryParams,
    body: PutLessonInfoInboundPortInputDto,
  ): Promise<Boolean>;
}
