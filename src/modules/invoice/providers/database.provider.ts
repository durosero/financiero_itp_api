import { DynamicModule, ModuleMetadata } from '@nestjs/common';
import { resolve } from 'path';
import { EConnection } from 'src/constants/database.constant';
import { DataSource } from 'typeorm';

export const databaseProviders= {
  provide: 'DATA_SOURCE',
  useFactory: async () => {
    console.log(
      resolve(__dirname, '../entities/SysApolo/**/*.entity{.ts,.js}'),
    );

    const dataSource = new DataSource({
      // name: EConnection.SYSAPOLO,
      type: 'mssql',
      host: process.env.MSSQL_SYSAPOLO_SERVER,
      username: process.env.MSSQL_SYSAPOLO_USER,
      password: process.env.MSSQL_SYSAPOLO_PASS,
      database: process.env.MSSQL_SYSAPOLO_DATABASE,
      entities: [
        resolve(__dirname, '../entities/SysApolo/**/*.entity{.ts,.js}'),
      ],
      options: {
        trustServerCertificate: true,
      },
      synchronize: false,
      logging: 'all',
    });

    return dataSource.initialize();
  },
};
