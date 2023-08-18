import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundError extends HttpException {
  constructor(message?: string) {
    super(message || 'httpError:notFoundError', HttpStatus.NOT_FOUND);
  }
}
