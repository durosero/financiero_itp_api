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
    const status = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226].includes(
      payload.statusCode,
    )
      ? EStatusLog.OK
      : EStatusLog.ERROR;

    const requestLog = this.requestLogsRepository.create({
      estado: status,
      host: payload.host,
      jsonJody: JSON.stringify(payload.bodyRequest),
      jsonResponse: JSON.stringify(payload.bodyResponse),
      urlService: payload.urlServide,
      fecha: new Date(),
    });

    return this.requestLogsRepository.save(requestLog);
  }
}
