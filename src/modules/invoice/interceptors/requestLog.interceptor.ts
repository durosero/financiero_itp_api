import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { IRequestLog } from 'src/interfaces/responseInvoice.interface';
import { RequestLogService } from '../services/requestLog.service';

@Injectable()
export class RequesLogtInterceptor implements NestInterceptor {
  constructor(private readonly requestLogService: RequestLogService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { body, url, headers } = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap((responseBody) => {
        const payload: IRequestLog = {
          bodyRequest: body,
          bodyResponse: responseBody,
          clientIp: headers['x-forwarded-for'] || headers['x-real-ip'],
          headerRequest: headers,
          invoiceId: body?.Referencia_pago,
          urlService: `${process.env.BASE_URL}${url}`,
          statusCode: response.statusCode ?? 0,
        };

        return this.requestLogService.saveLog(payload);
      }),
    );
  }
}
