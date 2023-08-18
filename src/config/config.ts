import { registerAs } from '@nestjs/config';
import { EConnection } from '../constants/database.constant';

export default registerAs('config', () => {
  const env = process.env;

  return {
    database: {
      name: EConnection.SYSAPOLO,
      // type: 'mssql',
      host: env.MSSQL_SYSAPOLO_SERVER,
      username: env.MSSQL_SYSAPOLO_USER,
      password: env.MSSQL_SYSAPOLO_PASS,
      database: env.MSSQL_SYSAPOLO_DATABASE,
      autoLoadEntities: true,
      options: {
        trustServerCertificate: true,
      },
      synchronize: false,
      // logging: 'all',
    },
  };
});
