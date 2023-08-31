import { SqlRepositoryBase } from '../../../../common/db/sql-repository.base';
import { LessonEntity } from '../entitity/lesson.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachesEntity } from '../entitity/coaches.entity';

export class LessonRepository extends SqlRepositoryBase<LessonEntity> {
  protected tableName: string = 'Lessons';

  @InjectRepository(LessonEntity)
  protected readonly repository: Repository<LessonEntity>;
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findAllByCoachId(coachId: number): Promise<LessonEntity[]> {
    return await this.repository
      .createQueryBuilder(this.tableName)
      .where({ coachId })
      .getMany();
  }
}
