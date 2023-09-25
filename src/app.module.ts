import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/config';
import { getEnvirontment } from './config/environments';
import { EConnection } from './constants/database.constant';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { TasksService } from './services/tasks.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvirontment(),
      load: [config],
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      // name: EConnection.SIGEIN,
      type: 'mysql',
      host: process.env.MYSQL_SGD_HOST,
      username: process.env.MYSQL_SGD_USER,
      password: process.env.MYSQL_SGD_PASS,
      database: process.env.MYSQL_SGD_DATABASE,
      entities: [],
      autoLoadEntities: true,
      synchronize: false,
      logging: 'all',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
    }),
    ScheduleModule.forRoot(),
    InvoiceModule,
  ],
  controllers: [AppController],
  exports: [],
  providers: [AppService, TasksService],
})
export class AppModule {}
