import { SqlRepositoryBase } from '../../../../common/db/sql-repository.base';
import { CustomersEntity } from '../entitity/customers.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersRepositoryPort } from './customers.repository.port';
import { ICustomerDao } from '../../interface/req-lesson.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LessonEntity } from '../entitity/lesson.entity';
import { IUserDao } from '../../interface/get-lesson-info.interface';
import { ICustomerChangeDao } from '../../interface/put-lesson-info.interface';

export class CustomersRepository
  extends SqlRepositoryBase<CustomersEntity>
  implements CustomersRepositoryPort
{
  protected tableName: string = 'Customers';

  @InjectRepository(CustomersEntity)
  protected repository: Repository<CustomersEntity>;

  constructor(dataSource: DataSource, entityManager: EntityManager) {
    super(dataSource, entityManager);
  }

  async getCustomerAndLessonsByPassword(
    password: string,
  ): Promise<CustomersEntity> {
    try {
      const res = await this.repository
        .createQueryBuilder(this.tableName)
        .where({ password })
        .leftJoinAndSelect('Customers.lessons', 'lessons')
        .getOne();
      return res;
    } catch (err) {
      if (
        err.message === "Cannot read properties of null (reading 'lessons')"
      ) {
        throw new HttpException(
          {
            message: '유저를 찾지 못했습니다',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async insertCustomer(userDataDao: ICustomerDao): Promise<number> {
    try {
      const { username, password, phoneNumber, customerName } = userDataDao;
      await this.repository.insert({
        username,
        password,
        name: customerName,
        phoneNumber,
      });
      const res = await this.repository
        .createQueryBuilder(this.tableName)
        .where({ username })
        .getOne();

      return Number(res.id);
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCustomerAndLessons(user: IUserDao): Promise<LessonEntity[]> {
    const { username, password } = user;
    try {
      const res = await this.repository
        .createQueryBuilder(this.tableName)
        .where({ username })
        .andWhere({ password })
        .leftJoinAndSelect('Customers.lessons', 'lessons')
        .getOne();
      return res.lessons;
    } catch (err) {
      if (
        err.message === "Cannot read properties of null (reading 'lessons')"
      ) {
        throw new HttpException(
          {
            message: '유저를 찾지 못했습니다',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async putCustomerNameAndPhoneNumber(
    userInfo: ICustomerChangeDao,
  ): Promise<Boolean> {
    try {
      const { phoneNumber, customerName, username, password } = userInfo;
      const res = await this.repository
        .createQueryBuilder()
        .update(this.tableName)
        .where({ username })
        .andWhere({ password })
        .set({ phoneNumber, name: customerName })
        .execute();
      return res.affected > 0;
    } catch (err) {
      if (
        err.message === "Cannot read properties of null (reading 'lessons')"
      ) {
        throw new HttpException(
          {
            message: '유저를 찾지 못했습니다',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
