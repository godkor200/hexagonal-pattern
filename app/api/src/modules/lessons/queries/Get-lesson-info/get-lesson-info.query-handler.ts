import {
  GetLessonInfoInboundPort,
  GetLessonInfoInboundPortInputDto,
} from '../../interface/get-lesson-info.interface';
import { LessonEntity } from '../../database/entitity/lesson.entity';
import { Inject } from '@nestjs/common';
import { CUSTOMERS_REPOSITORY } from '../../constants/lesson.di-token';
import { CustomersRepositoryPort } from '../../database/repository/customers.repository.port';

export class GetLessonInfoQueryHandler implements GetLessonInfoInboundPort {
  constructor(
    @Inject(CUSTOMERS_REPOSITORY)
    protected readonly customersRepository: CustomersRepositoryPort,
  ) {}
  async execute(
    params: GetLessonInfoInboundPortInputDto,
  ): Promise<LessonEntity[]> {
    return await this.customersRepository.getCustomerAndLessons(params);
  }
}
