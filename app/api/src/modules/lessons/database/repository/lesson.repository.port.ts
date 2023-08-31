import { RepositoryPort } from '../../../../common/db/sql-repository.interface';
import { LessonEntity } from '../entitity/lesson.entity';
import { CoachesEntity } from '../entitity/coaches.entity';

export interface LessonRepositoryPort extends RepositoryPort<LessonEntity> {
  findAllByCoachId(coachId: number): Promise<LessonEntity[]>;
}
