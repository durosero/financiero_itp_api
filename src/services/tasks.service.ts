import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '../constants/cronExpression.enum';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
