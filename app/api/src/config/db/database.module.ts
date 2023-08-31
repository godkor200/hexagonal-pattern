import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './service/database.mysql';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useClass: TypeOrmConfigService,
  inject: [TypeOrmConfigService],
};
@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmConfigAsync)],
})
export class DatabaseModule {}
