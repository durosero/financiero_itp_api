import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res
} from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment';
import { NotFoundError } from '../../classes/httpError/notFounError';
import { IPaymentRegister } from '../../interfaces/payment.interface';
import {
  EResponseDescription,
  EResposeStatusCode, IReponsePayment, IResponseInvoice
} from '../../interfaces/responseInvoice.interface';
import { MESSAGE_RESPONSE } from './constant/invoice.constant';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import { ValidateInvoiceDto } from './dto/validate-invoice.dto';
import { ESeverity } from './enums/invoice.enum';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './repositories/invoice.repository';
import { ConsultInvoiceService } from './services/consultInvoice.service';
import { InvoiceSysService } from './services/invoiceSys.service';
@Controller('caja')
export class CashController {
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

    const responsePayment = await this.getStatusInvoicePayment(payload);
    if (!responsePayment)
      throw new NotFoundError('No se encontraron pagos en el banco');

    const registerInvoice = await this.invoiceService.registerPaymentCash(
      responsePayment,
      invoice,
    );

    this.invoiceSysService.registerInvoiceSysApolo(invoice);

    return res.send();
  }

  @Post('/reverso')
  @HttpCode(200)
  async reversoFactura(@Body() payload: ReversePaymentDto) {
    const status = await this.invoiceService.reversePayment(payload);

    const response = {
      codigo_estado: status,
      severidad: Object.values(ESeverity)[status],
      descripcion: MESSAGE_RESPONSE[status],
    };

    return response;
  }

  async getStatusInvoicePayment({
    referencia_pago,
  }: ValidateInvoiceDto): Promise<IPaymentRegister | null> {
    try {
      // const resp  = await  axios.get<IReponsePayment>('https://api-colombia.com/api/v1/Department');
      const { data, status } = await axios.get(
        'https://api-colombia.com/api/v1/Department',
        {
          headers: {
            Accept: 'application/json',
          },
          params: {
            referencia_pago,
          },
        },
      );

      const paymentResponse: IReponsePayment = {
        referencia_pago: referencia_pago,
        estado_pago: 1,
        valor_pagado: 13470,
        codigo_transaccion: '1970816193',
        fecha: '15/03/2023 09:47:25',
      };

      const parseResponse: IPaymentRegister = {
        invoiceId: Number(paymentResponse.referencia_pago),
        value: paymentResponse.valor_pagado,
        transactionCode: paymentResponse.codigo_transaccion,
        status: paymentResponse.estado_pago,
        date: moment(paymentResponse.fecha, 'DD/MM/YYYY HH:mm:ss').toDate(),
        bankId: 3, // TODO: implemten bank id
      };

      return parseResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
