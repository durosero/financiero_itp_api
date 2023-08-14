import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EConnection } from './constants/database.constant';
import { DetailInvoiceSys } from './modules/invoice/entities/SysApolo/detailInvoiceSys.entity';
import { InvoiceSys } from './modules/invoice/entities/SysApolo/invoiceSys.entity';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
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
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
