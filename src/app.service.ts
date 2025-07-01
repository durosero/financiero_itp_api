import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  private version: number = new Date().getTime();
  getHello(): object {
    return {
      message: 'Hola mundo v2',
      developer: 'Duvan Rosero',
      version: this.version,
      error: false,
      env: this.config.get<string>('NODE_ENV'),
      base_url: this.config.get<string>('BASE_URL'),
    };
  }
}
