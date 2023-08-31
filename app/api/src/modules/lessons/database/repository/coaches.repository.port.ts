import { CoachesEntity } from '../entitity/coaches.entity';
import { RepositoryPort } from '../../../../common/db/sql-repository.interface';

export interface CoachesRepositoryPort extends RepositoryPort<CoachesEntity> {
  findOneByCoachName(coachName: string): Promise<CoachesEntity>;
}
