import { RepositoryPort } from '../../../../common/db/sql-repository.interface';
import { CustomersEntity } from '../entitity/customers.entity';
import { ICustomerDao } from '../../interface/req-lesson.interface';
import { IUserDao } from '../../interface/get-lesson-info.interface';
import { LessonEntity } from '../entitity/lesson.entity';
import { ICustomerChangeDao } from '../../interface/put-lesson-info.interface';

export interface CustomersRepositoryPort
  extends RepositoryPort<CustomersEntity> {
  insertCustomer(customerDao: ICustomerDao): Promise<number>;

  getCustomerAndLessonsByPassword(password: string): Promise<CustomersEntity>;

  getCustomerAndLessons(userDao: IUserDao): Promise<LessonEntity[]>;

  putCustomerNameAndPhoneNumber(userInfo: ICustomerChangeDao): Promise<Boolean>;
}
