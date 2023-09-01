import { RepositoryPort } from '../../../../common/db/sql-repository.interface';
import { LessonEntity } from '../entitity/lesson.entity';
import { IPutLessonInfo } from '../../interface/put-lesson-info.interface';

export interface LessonRepositoryPort extends RepositoryPort<LessonEntity> {
  findAllByCoachId(coachId: number): Promise<LessonEntity[]>;

  putLessonInfo(arg: IPutLessonInfo): Promise<Boolean>;

  softDelLesson(id: string): Promise<Boolean>;
}
