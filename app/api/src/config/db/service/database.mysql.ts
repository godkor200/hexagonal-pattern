import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { LessonEntity } from '../../../modules/lessons/database/entitity/lesson.entity';
import { CoachesEntity } from '../../../modules/lessons/database/entitity/coaches.entity';
import { CourtsEntity } from '../../../modules/lessons/database/entitity/courts.entity';
import { CustomersEntity } from '../../../modules/lessons/database/entitity/customers.entity';
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('db.DB_HOST'),
      port: +this.configService.get<number>('db.DB_PORT'),
      username: this.configService.get('db.MYSQL_ROOT_USER'),
      password: this.configService.get('db.MYSQL_PASSWORD'),
      database: this.configService.get('db.DB_SCHEMA'),
      entities: [LessonEntity, CoachesEntity, CourtsEntity, CustomersEntity],
      migrations: [],
      synchronize: false,
    };
  }
}
