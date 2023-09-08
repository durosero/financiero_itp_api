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

    // TypeOrmModule.forRootAsync({
    //   // Use useFactory, useClass, or useExisting
    //   // to configure the DataSourceOptions.
    //   inject: [config.KEY, 'DATA_SOURCE'],

    //   useFactory: async (configConstant: ConfigType<typeof config>) => {
    //     return {
    //       ...configConstant.database,
    //       type: 'mssql',
    //       logging: 'all',
    //       datasource: '',
    //     };
    //   },
    //   // dataSource receives the configured DataSourceOptions
    //   // and returns a Promise<DataSource>.
    //   dataSourceFactory: async (options) => {
    //     const dataSource = await new DataSource(options).initialize();
    //     return dataSource;
    //   },
    // }),

    TypeOrmModule.forRoot({
      name: EConnection.SYSAPOLO,
      type: 'mssql',
      
      host: process.env.MSSQL_SYSAPOLO_SERVER,
      username: process.env.MSSQL_SYSAPOLO_USER,
      password: process.env.MSSQL_SYSAPOLO_PASS,
      database: process.env.MSSQL_SYSAPOLO_DATABASE,
      entities: [],
      autoLoadEntities: true,

      options: {
        trustServerCertificate: true,
      },
      synchronize: false,
      logging: 'all',
    }),

    ScheduleModule.forRoot(),

    InvoiceModule,
  ],
  controllers: [AppController],
  exports: [],
  providers: [AppService,TasksService],
})
export class AppModule {}
