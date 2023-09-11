import { SqlRepositoryBase } from '../../../../common/db/sql-repository.base';
import { LessonEntity } from '../entitity/lesson.entity';
import { DataSource, Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { HttpException, HttpStatus } from '@nestjs/common';
import { LessonRepositoryPort } from './lesson.repository.port';

import { IPutLessonInfo } from '../../interface/put-lesson-info.interface';

import { LessonNumber } from '../../interface/get-lesson-available-info.interface';
import { getDayOfWeek } from '../../helpers/lesson.helpers';

export class LessonRepository
  extends SqlRepositoryBase<LessonEntity>
  implements LessonRepositoryPort
{
  protected tableName: string = 'Lessons';

  @InjectRepository(LessonEntity)
  protected readonly repository: Repository<LessonEntity>;

  constructor(dataSource: DataSource, entityManager: EntityManager) {
    super(dataSource, entityManager);
  }
  async softDelLesson(id: string): Promise<Boolean> {
    try {
      const res = await this.updateOne({ id, isCancelled: 1 });
      return res.success;
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllByCoachId(coachId: number): Promise<LessonEntity[]> {
    try {
      return await this.repository
        .createQueryBuilder(this.tableName)
        .where({ coachId })
        .getMany();
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async putLessonInfo({
    idx,
    coachId,
    timesPerWeek,
    lessonTimes,
    endTime,
  }: IPutLessonInfo): Promise<Boolean> {
    try {
      const lessonType = this.getLessonType(timesPerWeek);

      for await (const [index, value] of idx.entries()) {
        if (idx.length === timesPerWeek || timesPerWeek >= index + 1) {
          await this.updateOne({
            id: idx[index],
            startTime: lessonTimes[index],
            endTime: endTime,
            coachId: coachId,
            lessonType,
            dayOfweek: getDayOfWeek(
              lessonTimes[index].toString().replace('T', ' '),
            ),
            isCancelled: 0,
          });
        } else {
          await this.updateOne({ id: idx[index], isCancelled: 1 });
        }
      }
      return true;
    } catch (err) {
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getLessonType(timesPerWeek: number): LessonNumber {
    switch (timesPerWeek) {
      case 3:
        return LessonNumber.THRICE;
      case 2:
        return LessonNumber.TWICE;
      default:
        return LessonNumber.ONCE;
    }
  }
}
