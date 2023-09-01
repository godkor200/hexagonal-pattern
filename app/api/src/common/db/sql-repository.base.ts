import { DataSource, Repository } from 'typeorm';
import {
  IResDto,
  RepositoryPort,
  updateObject,
} from './sql-repository.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
export abstract class SqlRepositoryBase<E> implements RepositoryPort<E> {
  constructor(private dataSource: DataSource) {}
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

  async transaction<T>(handler: () => Promise<T>): Promise<void | T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await handler();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
