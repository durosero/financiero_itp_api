import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { EConnection } from 'src/constants/database.constant';
import { DataSource } from 'typeorm';

export const databaseProviders = {
  provide: `DATA_SOURCE_${EConnection.SYSAPOLO}`,
  useFactory: async (config: ConfigService) => {
    const dataSource = new DataSource({
      name: EConnection.SYSAPOLO,
      type: 'mssql',
      host: config.get<string>('MSSQL_SYSAPOLO_SERVER'),
      username: config.get<string>('MSSQL_SYSAPOLO_USER'),
      password: config.get<string>('MSSQL_SYSAPOLO_PASS'),
      database: config.get<string>('MSSQL_SYSAPOLO_DATABASE'),
      port: Number(config.get<number>('MSSQL_SYSAPOLO_PORT')),
      entities: [
        resolve(__dirname, '../entities/SysApolo/**/*.entity{.ts,.js}'),
      ],
      options: {
        trustServerCertificate: false,
        encrypt: false,
      },
      pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      synchronize: false,
      logging: 'all',
    });

    return dataSource.initialize();
  },
};
