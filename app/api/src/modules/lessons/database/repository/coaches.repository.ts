import { SqlRepositoryBase } from '../../../../common/db/sql-repository.base';
import { CoachesEntity } from '../entitity/coaches.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachesRepositoryPort } from './coaches.repository.port';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CoachesRepository
  extends SqlRepositoryBase<CoachesEntity>
  implements CoachesRepositoryPort
{
  protected tableName: string = 'Coaches';
  @InjectRepository(CoachesEntity)
  protected readonly repository: Repository<CoachesEntity>;

  constructor(dataSource: DataSource, entityManager: EntityManager) {
    super(dataSource, entityManager);
  }

  async findOneByCoachName(coachName: string): Promise<CoachesEntity> {
    try {
      return await this.repository
        .createQueryBuilder(this.tableName)
        .where({ name: coachName })
        .getOne();
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
