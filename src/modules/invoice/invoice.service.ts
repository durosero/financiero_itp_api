import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { EConnection } from 'src/constants/database.constant';
import { DataSource, DeepPartial, In, Repository } from 'typeorm';
import { EmailService } from '../../services/email.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import { DetailPayment } from './entities/detailPayment.entity';
import { Invoice } from './entities/invoice.entity';
import { DetailInvoiceSys } from './entities/SysApolo/detailInvoiceSys.entity';
import { InvoiceSys } from './entities/SysApolo/invoiceSys.entity';
import {
  ESeverityCode,
  EStatusInvoice,
  ESysApoloStatus
} from './enums/invoice.enum';
import { DetailPaymentRepository } from './repositories/detailPayment.repository';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly emailService: EmailService,
    private readonly detailPaymentRepository: DetailPaymentRepository,
    private readonly dataSource: DataSource,

    @InjectRepository(InvoiceSys, EConnection.SYSAPOLO)
    private invoiceSysRepository: Repository<InvoiceSys>,

    @InjectRepository(DetailInvoiceSys, EConnection.SYSAPOLO)
    private detailInvoiceSysRepository: Repository<DetailInvoiceSys>,
  ) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    return 'This action adds a new invoice';
  }

  findAll() {
    const mailOptions: ISendMailOptions = {
      to: 'durosero@itp.edu.co',
      subject: 'Mensaje de prueba',
      text: 'hola mundo',
      // attachments: fileBuffer,
    };

    return this.emailService.sendCustomMail(mailOptions);
  }

  // Main reverse payment
  async reversePayment(payload: ReversePaymentDto): Promise<ESeverityCode> {
    const payments = await this.detailPaymentRepository.findPaymentsForReverse(
      payload,
    );

    if (isEmpty(payments)) return ESeverityCode.WARNING;
    const ids = payments.map((row) => row.id);

    const deleted = await this.deletePaymentInvoiceSigedin(payload, ids);
    if (deleted) {
      this.deleteInvoiceSysApolo(payload.referencia_pago);
      return ESeverityCode.INFORMATIVE;
    }

    return ESeverityCode.ERROR;
  }

  async deletePaymentInvoiceSigedin(
    payload: ReversePaymentDto,
    ids: string[],
  ): Promise<boolean> {
    const { referencia_pago, valor_pagado, fecha_reverso } = payload;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.delete(DetailPayment, {
        id: In(ids),
      });

      const invoice: DeepPartial<Invoice> = {
        estadoId: EStatusInvoice.PAGO_INICADO,
        fechaReverso: fecha_reverso,
        valorReverso: valor_pagado,
        fechaUpdate: new Date(),
        sysapoloVerify: ESysApoloStatus.PENDIENTE,
      };

      await queryRunner.manager.update(
        Invoice,
        {
          id: referencia_pago,
        },
        invoice,
      );
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return false;
    }
  }

  async deleteInvoiceSysApolo(invoiceId: number): Promise<boolean> {
    try {
      const invoiceSys = await this.invoiceSysRepository.findOne({
        where: { numRecibo: invoiceId },
      });
      await this.detailInvoiceSysRepository.delete({
        facturaId: invoiceSys.id,
      });
      await this.invoiceSysRepository.delete({ id: invoiceSys.id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
