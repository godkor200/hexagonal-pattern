import {
  DelLessonInboundPort,
  IDelDto,
} from '../../interface/del-lesson.interface';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  CUSTOMERS_REPOSITORY,
  LESSON_REPOSITORY,
} from '../../constants/lesson.di-token';
import { CustomersRepositoryPort } from '../../database/repository/customers.repository.port';
import { LessonRepositoryPort } from '../../database/repository/lesson.repository.port';

export class DeleteLessonCommandHandler implements DelLessonInboundPort {
  constructor(
    @Inject(CUSTOMERS_REPOSITORY)
    protected readonly customersRepository: CustomersRepositoryPort,

    @Inject(LESSON_REPOSITORY)
    protected readonly lessonRepository: LessonRepositoryPort,
  ) {}
  async execute(arg: IDelDto): Promise<Boolean> {
    const userAndLessons =
      await this.customersRepository.getCustomerAndLessonsByPassword(
        arg.password,
      );

    const lessonIdCheck = userAndLessons.lessons.find(
      (e) => e.id == Number(arg.lessonId),
    );
    if (!lessonIdCheck) {
      throw new HttpException(
        {
          message: '레슨을 찾을수 없습니다',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.lessonRepository.softDelLesson(arg.lessonId);
  }
}
