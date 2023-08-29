import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import Mail from 'nodemailer/lib/mailer';
import { resolve } from 'path';
import { DataSource, DeepPartial, In } from 'typeorm';
import { IInfoInvoice } from '../../interfaces/enrollment.interface';
import {
  IPaymentReceipt,
  IPaymentRegister,
  IPaymentSearch
} from '../../interfaces/payment.interface';
import { messageEmailPaymentOk } from '../../utils/messages.util';
import {
  compileHBS,
  convertHTMLtoPDF,
  initializeHelpersHbs
} from '../../utils/reportPdf.util';

import {
  calcularTotales,
  createQRBase64,
  llenarSubTotal
} from '../../utils/invoice.util';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import { DetailPayment } from './entities/detailPayment.entity';
import { Invoice } from './entities/invoice.entity';
import {
  EFormPayment,
  ESeverityCode,
  EStatusInvoice,
  ESysApoloStatus
} from './enums/invoice.enum';
import { DetailPaymentRepository } from './repositories/detailPayment.repository';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceSysService } from './services/invoiceSys.service';
@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceSysService: InvoiceSysService,
    private readonly detailPaymentRepository: DetailPaymentRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly dataSource: DataSource,
    private mailerService: MailerService,
  ) {}

  async registerPaymentCash(payload: IPaymentRegister, invoice: Invoice) {
    const searchData: IPaymentSearch = { ...payload };

    const payments = await this.detailPaymentRepository.findPaymentsForReverse(
      searchData,
    );

    if (!isEmpty(payments)) return true;
    const registered = await this.registerPaymentInvoiceSigedin(payload);

    if (registered) {
      const { person, categoryInvoice } = invoice;

      this.getPdfPaymentReceipt(searchData.invoiceId)
        .then((buffer) => {
          const attachment: Mail.Attachment = {
            content: buffer,
            filename: `${person.id}-${searchData.transactionCode}.pdf`,
            contentType: 'application/pdf',
          };
          const mailOptions: ISendMailOptions = {
            to:
              process.env.NODE_ENV != 'pro'
                ? process.env.EMAIL_TEST
                : person.email,
            subject: 'Recibo de pago - Pago exitoso',
            text: messageEmailPaymentOk(
              person,
              categoryInvoice.descripcion,
              invoice.id,
            ),
            attachments: [attachment],
          };

          this.mailerService.sendMail(mailOptions);
        })
        .catch((error) => {
          console.log('No se ha podido generar el pdf: ', error);
        });
    }

    return registered;
  }

  async equide(invoiceId: number) {
    const invoice = await this.invoiceRepository.findById(invoiceId);

    const buffer = await this.getPdfPaymentReceipt(invoiceId);
    const { person, categoryInvoice } = invoice;

    const attachment: Mail.Attachment = {
      content: buffer,
      filename: `${invoiceId}.pdf`,
      contentType: 'application/pdf',
    };
    const mailOptions: ISendMailOptions = {
      to: process.env.NODE_ENV != 'pro' ? process.env.EMAIL_TEST : person.email,
      subject: 'Recibo de pago - Pago exitoso',
      text: messageEmailPaymentOk(
        person,
        categoryInvoice.descripcion,
        invoiceId,
      ),
      attachments: [attachment],
    };

    return await this.mailerService.sendMail(mailOptions);
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

  async getDetailInvoice(invoiceId: number) {
    return this.invoiceRepository.findFullById(invoiceId);
  }

  async getHTMLPaymentReceipt(invoiceId: number): Promise<string> {
    const {
      jsonResponse,
      categoryInvoice,
      detailInvoices,
      detailPayments,
      ...invoice
    } = await this.invoiceRepository.findFullById(invoiceId);
    //TODO: add QrCode

    const { info_cliente }: IInfoInvoice = JSON.parse(jsonResponse);
    const { totalExtraordinario: total } = calcularTotales(detailInvoices);

    const url = `${process.env.BASE_URL}/invoice/payment/pdf/${invoice.id}`;
    const qrBase64 = await createQRBase64(url);

    const dataReport: IPaymentReceipt = {
      client: info_cliente,
      category: categoryInvoice,
      detailInvoice: llenarSubTotal(detailInvoices),
      detailPayment: detailPayments,
      invoice,
      totalInt: total,
      qrBase64,
      url,
    };
    const pathTemplateBody = resolve(
      __dirname,
      '../../',
      'templates/reciboPago.pdf.hbs',
    );

    initializeHelpersHbs();
    const templateHtml = compileHBS(pathTemplateBody, dataReport);
    return templateHtml;
  }

  async getPdfPaymentReceipt(invoiceId: number): Promise<Buffer> {
    const templateHtml = await this.getHTMLPaymentReceipt(invoiceId);
    const buffer = await convertHTMLtoPDF(templateHtml);
    return buffer;
  }
}
