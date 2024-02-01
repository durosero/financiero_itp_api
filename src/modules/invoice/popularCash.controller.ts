import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import * as moment from 'moment';
import { IPaymentRegister } from 'src/interfaces/payment.interface';
import { getStatusInvoicePaymentWs } from 'src/utils/webService.util';
import { NotFoundError } from '../../classes/httpError/notFounError';
import {
  EResponseDescription,
  EResposeStatusCode,
  IResponseInvoice,
} from '../../interfaces/responseInvoice.interface';
import { MESSAGE_RESPONSE_REVERSE } from './constant/invoice.constant';
import { BbvaRegisterPaymentDto } from './dto/bbva-register-payment';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import { ValidateInvoiceDto } from './dto/validate-invoice.dto';
import {
  EBankCash,
  ERegisterDescription,
  ESeverity,
  ESeverityCode,
  EStatusInvoice,
} from './enums/invoice.enum';
import { RequesLogtInterceptor } from './interceptors/requestLog.interceptor';
import { InvoiceRepository } from './repositories/invoice.repository';
import { ConsultInvoiceService } from './services/consultInvoice.service';
import { InvoiceService } from './services/invoice.service';
import { InvoiceSysService } from './services/invoiceSys.service';
@Controller('caja')
export class PopularCashController {
  private readonly logger = new Logger('POPULAR-ENDPOINT');

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoiceSysService: InvoiceSysService,
    private readonly consultInvoiceService: ConsultInvoiceService,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  @Get('/consultarfactura')
  @HttpCode(200)
  async consultarFactura(@Query() payload: ValidateInvoiceDto) {
    try {
      const invoice = await this.consultInvoiceService.searchInvoiceForPayment(
        Number(payload.referencia_pago),
      );
      const response: IResponseInvoice = {
        valor_factura: invoice.valor,
        descripcion_estado: EResponseDescription.OK,
        codigo_estado: EResposeStatusCode.OK,
        fecha_limite_pago: moment(invoice.fechaLimite).format('DD/MM/YYYY'),
      };
      return response;
    } catch (error) {
      return {
        valor_factura: 0,
        descripcion_estado: EResponseDescription.WARNING,
        codigo_estado: EResposeStatusCode.WARNING,
        fecha_limite_pago: moment(new Date()).format('DD/MM/YYYY'),
        descripcion_general: error?.message ?? null,
      };
    }
  }

  @Get('/notificacion')
  @HttpCode(200)
  async notificacionFactura(@Query() payload: ValidateInvoiceDto, @Res() res) {
    const invoice = await this.invoiceRepository.findById(
      Number(payload.referencia_pago),
    );
    if (!invoice) throw new NotFoundError('Factura no encontrada');

    const responsePayment = await getStatusInvoicePaymentWs(
      payload.referencia_pago,
    );
    if (!responsePayment)
      throw new NotFoundError('No se encontraron pagos en el banco');

    const registerInvoice = await this.invoiceService
      .registerPaymentCash(responsePayment, invoice)
      .catch(console.log);

    this.invoiceSysService
      .registerInvoiceSysApolo(invoice.id)
      .catch(console.log);

    return res.send();
  }

  @Post('/reverso')
  @HttpCode(200)
  async reversoFactura(@Body() payload: ReversePaymentDto) {
    try {
      const status = await this.invoiceService.reversePayment(payload);

      const response = {
        codigo_estado: status,
        severidad: Object.values(ESeverity)[status],
        descripcion: MESSAGE_RESPONSE_REVERSE[status],
      };

      return response;
    } catch (error) {
      this.logger.warn(error);
      return {
        Descripcion: MESSAGE_RESPONSE_REVERSE[2],
        Severidad: ESeverity.ERROR,
        Codigo_estado: EResposeStatusCode.ERROR,
      };
    }
  }

  @UseInterceptors(RequesLogtInterceptor)
  @Post('/registrarpagos')
  async registrarFactura(@Body() payload: BbvaRegisterPaymentDto) {
    try {
      const invoice = await this.invoiceRepository.findById(
        Number(payload.Referencia_pago),
      );

      if (!invoice) throw new NotFoundError('Factura no encontrada');

      const payloadRegister: IPaymentRegister = {
        date: payload.Fecha_pago,
        invoiceId: Number(payload.Referencia_pago),
        status: EStatusInvoice.PAGO_FINALIZADO_OK,
        transactionCode: payload.Id_transaccion,
        value: payload.Valor_pagado,
        bankId: payload.Id_Banco,
        name_bank: EBankCash.POPULAR,
      };

      const success = await this.invoiceService.registerPaymentCash(
        payloadRegister,
        invoice,
      );

      if (success) {
        return {
          Descripcion: ERegisterDescription.INFORMATIVE,
          Severidad: ESeverity.INFORMATIVE,
          Codigo_estado: ESeverityCode.INFORMATIVE,
        };
      }

      return {
        Descripcion: ERegisterDescription.WARNING,
        Severidad: ESeverity.WARNING,
        Codigo_estado: ESeverityCode.WARNING,
      };
    } catch (error) {
      this.logger.warn(error);
      return {
        Descripcion: ERegisterDescription.ERROR,
        Severidad: ESeverity.ERROR,
        Codigo_estado: ESeverityCode.ERROR,
      };
    }
  }
}
