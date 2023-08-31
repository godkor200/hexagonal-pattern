import { Module } from '@nestjs/common';
import { EntityModule } from './lessons/database/entitity/entity.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [LessonsModule],
})
export class BusinessModules {}
