import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  IResDto,
  RepositoryPort,
  updateObject,
} from './sql-repository.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
export abstract class SqlRepositoryBase<E> implements RepositoryPort<E> {
  protected constructor(
    private readonly dataSource: DataSource,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  protected abstract tableName: string;
  protected abstract repository: Repository<E>;

  async delete(id: string): Promise<boolean> {
    try {
      const res = await this.repository
        .createQueryBuilder(this.tableName)
        .delete()
        .from(this.tableName)
        .where({ id })
        .execute();
      return res.raw > 0;
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<E[]> {
    try {
      return await this.repository.find();
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneById(id: string | number): Promise<E> {
    try {
      return await this.repository
        .createQueryBuilder(this.tableName)
        .where({ id: id })
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

  async insert(entity: E): Promise<IResDto> {
    try {
      const res = await this.repository
        .createQueryBuilder(this.tableName)
        .insert()
        .into(this.tableName)
        .values(entity)
        .execute();
      return { success: res.raw > 0 };
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        // 여기서 transactionalEntityManager 를 사용해 데이터베이스 작업을 수행하면,
        // 모든 작업은 동일한 트랜잭션에 속하게 됩니다.
        // 이 객체를 필요한 곳에 전달하는 로직을 구현할 수 있습니다.
        console.log(transactionalEntityManager);
        try {
          const result = await handler();
          return result;
        } catch (e) {
          throw e;
        }
      },
    );
  }

  async updateOne(params: updateObject): Promise<IResDto> {
    try {
      const res = await this.repository
        .createQueryBuilder()
        .update(this.tableName)
        .set(params)
        .where({ id: params.id })
        .execute();
      return { success: res.affected > 0 };
    } catch (err) {
      throw new HttpException(
        {
          message: err.sqlMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
