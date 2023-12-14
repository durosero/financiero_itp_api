import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InvoiceRepository } from 'src/modules/invoice/repositories/invoice.repository';
import { CronExpression } from '../constants/cronExpression.enum';
import { CronJob } from 'cron';
import { InvoiceSysService } from 'src/modules/invoice/services/invoiceSys.service';
import { getStatusInvoicePaymentWs } from 'src/utils/webService.util';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';
import { DetailPaymentRepository } from 'src/modules/invoice/repositories/detailPayment.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly detailPaymentRepository: DetailPaymentRepository,
    private schedulerRegistry: SchedulerRegistry,
    private invoiceSysService: InvoiceSysService,
    private readonly invoiceService: InvoiceService,
  ) {
    this.registerJobInvoicesSysApolo();
  }
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async deleteUnpaidInvoices() {
    const deleteInvoices = await this.invoiceRepository.deleteInvoices();
    this.logger.debug('The following invoices was removed', deleteInvoices);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async sendPendingPaymentsToEmail() {
    this.logger.warn(`start cron job sendPendingPaymentsToEmail`);
    const payments = await this.detailPaymentRepository.findPaymentsOkByDate();

    for (const { invoice } of payments) {
      try {
        const responseEmail = await this.invoiceService.sendPaymentEmail(
          invoice.id,
        );
      } catch (error) {
        this.logger.warn(error);
      }
    }
  }

  async registerJobInvoicesSysApolo() {
    const job = new CronJob(CronExpression.EVERY_DAY_AT_MIDNIGHT, async () => {
      this.logger.warn(`start cron job sysAploInvoice`);
      const invoices = await this.invoiceRepository.getPaidInvoiceLimit(50);
      console.log(JSON.stringify(invoices));
      try {
        for (const { id } of invoices) {
          await this.invoiceSysService.registerInvoiceSysApolo(id);
        }
      } catch (error) {
        this.logger.warn(error);
      }
    });

    this.schedulerRegistry.addCronJob('sysAploInvoice', job);
    job.start();
    return job.lastDate();
  }

  async stopRegisterInvoicesSysApolo() {
    const job = this.schedulerRegistry.getCronJob('sysAploInvoice');
    job.stop();
    this.logger.warn(`stop cron job sysAploInvoice`);
    return job.lastDate();
  }
  async startRegisterInvoicesSysApolo() {
    const job = this.schedulerRegistry.getCronJob('sysAploInvoice');
    job.start();
    this.logger.warn(`start cron job sysAploInvoice`);
    return job.lastDate();
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async checkStatusInvoiceCash() {
  //   const invoices = await this.invoiceRepository.findInvoicesCash();
  //   try {
  //     for (let i = 0; i < invoices.length; i++) {
  //       const invoice = invoices[i];
  //       setTimeout(async () => {
  //         const responseBank = await getStatusInvoicePaymentWs(
  //           invoice.id.toString(),
  //         );
  //         const registerInvoice = await this.invoiceService.registerPaymentCash(
  //           responseBank,
  //           invoice,
  //         );
  //       }, i * 5000);
  //     }
  //   } catch (error) {
  //     this.logger.error(`checkStatusInvoiceCash `, error);
  //   }
  // }
}
