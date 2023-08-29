import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Hola mundo',
      developer: 'Duvan Rosero',
      error: false,
      env: process.env.NODE_ENV,
      base_url: process.env.BASE_URL,
    };
  }
}
