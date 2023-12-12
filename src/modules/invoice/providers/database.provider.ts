import { resolve } from 'path';
import { EConnection } from 'src/constants/database.constant';
import { DataSource } from 'typeorm';

export const databaseProviders = {
  provide: `DATA_SOURCE_${EConnection.SYSAPOLO}`,
  useFactory: async () => {
    const dataSource = new DataSource({
      name: EConnection.SYSAPOLO,
      type: 'mssql',
      host: process.env.MSSQL_SYSAPOLO_SERVER,
      username: process.env.MSSQL_SYSAPOLO_USER,
      password: process.env.MSSQL_SYSAPOLO_PASS,
      database: process.env.MSSQL_SYSAPOLO_DATABASE,
      port: Number(process.env.MSSQL_SYSAPOLO_PORT) || 1433,
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
