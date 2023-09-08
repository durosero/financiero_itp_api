import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TasksService } from './services/tasks.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
  @Get('stop-job-sysapolo')
  async stopJobSysApolo() {
    return this.tasksService.stopRegisterInvoicesSysApolo();
  }
  @Get('start-job-sysapolo')
  async startJobSysApolo() {
    return this.tasksService.startRegisterInvoicesSysApolo();
  }
}
