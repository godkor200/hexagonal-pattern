import { GetLessonAvailableInfoInboundPortInputDto } from './get-lesson-available-info.interface';
import { LessonEntity } from '../database/entitity/lesson.entity';
import {
  ICustomerDao,
  ReqLessonInboundPortInputDto,
} from './req-lesson.interface';

export interface GetLessonInfoInboundPortInputDto
  extends Pick<ICustomerDao, 'username' | 'password'> {}

export interface IUserDao extends GetLessonInfoInboundPortInputDto {}

export interface GetLessonInfoInboundPort {
  execute(params: GetLessonInfoInboundPortInputDto): Promise<LessonEntity[]>;
}
