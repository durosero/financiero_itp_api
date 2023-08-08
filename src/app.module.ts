import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: 'root',
      database: "sigedin_ies",
      // host: process.env.MYSQL_SGD_HOST,
      // username: process.env.MYSQL_SGD_USER,
      // password: process.env.MYSQL_SGD_PASS,
      // database: process.env.MYSQL_SGD_DATABASE,
      entities: [],
      autoLoadEntities: true,
      synchronize: false,
    }),
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
