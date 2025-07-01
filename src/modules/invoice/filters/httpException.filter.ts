import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { IRequestLog } from 'src/interfaces/responseInvoice.interface';
import { RequestLogService } from '../services/requestLog.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly requestLogService: RequestLogService,
    private config: ConfigService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.name;
    const message = exception.message;

    const bodyResponse = {
      statusCode: status,
      error,
      message:
        exception.getResponse()['message'] ||
        message ||
        'Internal Server Error',
      path: request.url,
    };

    const headers: any = request.headers;

    const payload: IRequestLog = {
      bodyRequest: request.body,
      bodyResponse,
      clientIp: headers['x-forwarded-for'] || headers['x-real-ip'],
      headerRequest: request.headers,
      invoiceId: request?.body?.Referencia_pago,
      urlService: `${this.config.get<string>('BASE_URL')}${request.url}`,
      statusCode: status,
    };

    this.requestLogService.saveLog(payload).catch(console.log);

    response.status(status).json(bodyResponse);
  }
}
