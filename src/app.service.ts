import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  private version: number = new Date().getTime();
  getHello(): object {
    return {
      message: 'Hola mundo v2',
      developer: 'Duvan Rosero',
      version: this.version,
      error: false,
      env: process.env.NODE_ENV,
      base_url: process.env.BASE_URL,
    };
  }
}
