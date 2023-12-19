import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EStatusLog,
  IRequestLog,
} from 'src/interfaces/responseInvoice.interface';
import { Repository } from 'typeorm';
import { RequestLog } from '../entities/requestLog.entity';

@Injectable()
export class RequestLogService {
  constructor(
    @InjectRepository(RequestLog)
    private requestLogsRepository: Repository<RequestLog>,
  ) {}

  async saveLog(payload: IRequestLog) {
    const requestLog = this.requestLogsRepository.create({
      urlService: payload.urlService,
      bodyRequest: JSON.stringify(payload.bodyRequest),
      bodyResponse: JSON.stringify(payload.bodyResponse),
      headerRequest: JSON.stringify(payload.headerRequest),
      statusCode: payload.statusCode,
      clientIp: payload.clientIp,
      invoiceId: payload.invoiceId,
      createdAt: new Date(),
    });

    return this.requestLogsRepository.save(requestLog);
  }
}
