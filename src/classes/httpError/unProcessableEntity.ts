import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export class UnprocessableEntity extends HttpException {
  constructor(message?: string) {
    super(
      message || 'httpError:unprocessableEntity',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
