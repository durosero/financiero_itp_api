import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import {
  IPaymentRegister,
  IPaymentSearch
} from 'src/interfaces/payment.interface';
import { DataSource, DeepPartial, In } from 'typeorm';
import { EmailService } from '../../services/email.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import { DetailPayment } from './entities/detailPayment.entity';
import { Invoice } from './entities/invoice.entity';
import {
  EFormPayment,
  ESeverityCode,
  EStatusInvoice,
  ESysApoloStatus
} from './enums/invoice.enum';
import { InvoiceSysService } from './invoiceSys.service';
import { DetailPaymentRepository } from './repositories/detailPayment.repository';
@Injectable()
export class InvoiceService {
  constructor(
    private readonly emailService: EmailService,
    private readonly invoiceSysService: InvoiceSysService,
    private readonly detailPaymentRepository: DetailPaymentRepository,
    private readonly dataSource: DataSource,
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

  async registerPaymentCash(payload: IPaymentRegister) {
    const searchData: IPaymentSearch = { ...payload };

    const payments = await this.detailPaymentRepository.findPaymentsForReverse(
      searchData,
    );

    // if (!isEmpty(payments)) return;

    const registered = await this.registerPaymentInvoiceSigedin(payload);

    // TODO: register in sysApolo and send EMAIL

    return payments;
  }

  async registerPaymentInvoiceSigedin(
    payload: IPaymentRegister,
  ): Promise<boolean> {
    const { invoiceId, value, transactionCode, status, date, bankId } = payload;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const payment: DeepPartial<DetailPayment> = {
        facturaId: invoiceId,
        valorPago: value,
        totalPago: value,
        fecha: date,
        estadoPagoId: status,
        formaPagoId: EFormPayment.EFECTIVO,
        codigoTransaccion: transactionCode,
        bancoRecaudoId: bankId,
        nombreBanco: 'BANCO POPULAR',
      };

      const invoice: DeepPartial<Invoice> = {
        estadoId: EStatusInvoice.PAGO_FINALIZADO_OK,
        fechaUpdate: new Date(),
        isOnline: 0,
      };

      await queryRunner.manager.insert(DetailPayment, payment);

      await queryRunner.manager.update(
        Invoice,
        {
          id: invoiceId,
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

  // Main reverse payment
  async reversePayment(payload: ReversePaymentDto): Promise<ESeverityCode> {
    const searchData: IPaymentSearch = {
      invoiceId: payload.referencia_pago,
      transactionCode: payload.codigo_transaccion,
      value: payload.valor_pagado,
    };

    const payments = await this.detailPaymentRepository.findPaymentsForReverse(
      searchData,
    );

    if (isEmpty(payments)) return ESeverityCode.WARNING;
    const ids = payments.map((row) => row.id);

    const deleted = await this.deletePaymentInvoiceSigedin(payload, ids);
    if (deleted) {
      this.invoiceSysService.deleteInvoiceSysApolo(payload.referencia_pago);
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
}
