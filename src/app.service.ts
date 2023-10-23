import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private version: number = new Date().getTime();
  getHello(): object {
    return {
      message: 'Hola muasdasndo',
      developer: 'Duvan Rosero',
      version: this.version,
      error: false,
      env: process.env.NODE_ENV,
      base_url: process.env.BASE_URL,
    };
  }
}
