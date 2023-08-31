import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesEntity } from './coaches.entity';
import { CourtsEntity } from './courts.entity';
import { CustomersEntity } from './customers.entity';
import { LessonEntity } from './lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LessonEntity,
      CoachesEntity,
      CourtsEntity,
      CustomersEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntityModule {}
