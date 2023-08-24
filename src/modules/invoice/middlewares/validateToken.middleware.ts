import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = process.env.BANCO_POPULAR_TOKEN || '';

    try {
      const xTokenHeader = req.header('X-Token') || null;
      if (!xTokenHeader || ['null', 'undefined'].includes(xTokenHeader))
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      if (xTokenHeader === token) {
        console.log('Request...', xTokenHeader);
        return next();
      }

      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } catch (error) {
      console.log(error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
