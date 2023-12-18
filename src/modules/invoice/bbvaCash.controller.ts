import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Req,
  Request,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import * as moment from 'moment';
import {
  EResponseDescription,
  EResposeStatusCode,
} from 'src/interfaces/responseInvoice.interface';
import { NotFoundError } from '../../classes/httpError/notFounError';
import { IPaymentRegister } from '../../interfaces/payment.interface';
import { MESSAGE_RESPONSE_REVERSE } from './constant/invoice.constant';
import { BbvaConsultInvoiceDto } from './dto/bbva-consult-invoice';
import { BbvaRegisterPaymentDto } from './dto/bbva-register-payment';
import { BbvaReversePaymentDto } from './dto/bbva-reverse-payment';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import {
  EBankCash,
  EBankCodeCash,
  ERegisterDescription,
  ESeverity,
  ESeverityCode,
  EStatusInvoice,
} from './enums/invoice.enum';
import { RequesLogtInterceptor } from './interceptors/requestLog.interceptor';

import { InvoiceRepository } from './repositories/invoice.repository';
import { ConsultInvoiceService } from './services/consultInvoice.service';
import { InvoiceService } from './services/invoice.service';

@Controller('caja/bbva')
export class BbvaCashController {
  constructor(
    private readonly consultInvoiceService: ConsultInvoiceService,
    private readonly invoiceService: InvoiceService,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  private readonly logger = new Logger('BBVA-ENDPOINT');

  @UseInterceptors(RequesLogtInterceptor)
  @Post('/consultarfactura')
  @HttpCode(200)
  async consultarFactura(@Body() payload: BbvaConsultInvoiceDto) {
    try {
      const invoice = await this.consultInvoiceService.searchInvoiceForPayment(
        Number(payload.Referencia_pago),
      );
      const response = {
        Valor_factura: invoice.valor,
        Descripción_estado: EResponseDescription.OK,
        Codigo_Estado: EResposeStatusCode.OK,
        Fecha_limite_pago: moment(invoice.fechaLimite).format('DD/MM/YYYY'),
      };
      return response;
    } catch (error) {
      this.logger.warn(error);
      return {
        Valor_factura: 0,
        Descripción_estado: EResponseDescription.WARNING,
        Codigo_Estado: EResposeStatusCode.WARNING,
        Fecha_limite_pago: moment().format('DD/MM/YYYY'),
        Info_Adicional: error?.message ?? null,
      };
    }
  }

  @UseInterceptors(RequesLogtInterceptor)
  @Post('/reversarpagos')
  async reversarFactura(@Body() payload: BbvaReversePaymentDto) {
    try {
      const payloadReverse: ReversePaymentDto = {
        codigo_transaccion: payload.Id_transaccion,
        fecha_reverso: payload.Fecha_reverso,
        id_banco: payload.Id_Banco,
        referencia_pago: Number(payload.Referencia_pago),
        valor_pagado: payload.Valor_pagado,
      };

      const status = await this.invoiceService.reversePayment(payloadReverse);
      return {
        Codigo_estado: status,
        Severidad: Object.values(ESeverity)[status],
        Descripcion: MESSAGE_RESPONSE_REVERSE[status],
      };
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
        // bankId: EBankCodeCash.BBVA,
        name_bank: EBankCash.BBVA,
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
