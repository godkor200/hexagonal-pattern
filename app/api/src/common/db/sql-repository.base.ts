import { DataSource, Repository } from 'typeorm';
import {
  IResDto,
  RepositoryPort,
  updateObject,
} from './sql-repository.interface';
export abstract class SqlRepositoryBase<E> implements RepositoryPort<E> {
  constructor(private dataSource: DataSource) {}
  protected abstract tableName: string;
  protected abstract repository: Repository<E>;

  async delete(id: string): Promise<boolean> {
    const res = await this.repository
      .createQueryBuilder(this.tableName)
      .delete()
      .from(this.tableName)
      .where({ id })
      .execute();
    return res.raw > 0;
  }

  async findAll(): Promise<E[]> {
    return await this.repository.find();
  }

  async findOneById(id: string): Promise<E> {
    return await this.repository
      .createQueryBuilder(this.tableName)
      .where({ id: id })
      .getOne();
  }

  async insert(entity: E): Promise<IResDto> {
    const res = await this.repository
      .createQueryBuilder(this.tableName)
      .insert()
      .into(this.tableName)
      .values(entity)
      .execute();
    return { success: res.raw > 0 };
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
    const res = await this.repository
      .createQueryBuilder()
      .update(this.tableName)
      .set(params)
      .where({ id: params.id })
      .execute();
    return { success: res.raw > 0 };
  }
}
