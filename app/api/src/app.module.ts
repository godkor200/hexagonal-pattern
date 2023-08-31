import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule as AppConfigModule } from './config/config.module';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db/database.env';
import { BusinessModules } from './modules/modules';
@Module({
  imports: [
    AppConfigModule,
    BusinessModules,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [dbConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
