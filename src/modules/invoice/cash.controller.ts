import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import axios from 'axios';
import e from 'express';
import * as moment from 'moment';
import { NotFoundError } from 'src/classes/httpError/notFounError';
import { IPaymentRegister } from 'src/interfaces/payment.interface';
import { IReponsePayment } from 'src/interfaces/responseInvoice.interface';
import { MESSAGE_RESPONSE } from './constant/invoice.constant';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import { ValidateInvoiceDto } from './dto/validate-invoice.dto';
import { ESeverity } from './enums/invoice.enum';
import { InvoiceService } from './invoice.service';
import { InvoiceSysService } from './invoiceSys.service';
import { InvoiceRepository } from './repositories/invoice.repository';
@Controller('caja')
export class CashController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoiceSysService: InvoiceSysService,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get('/consultarfactura')
  findAll(
    // @Query('id_banco', ParseIntPipe) idBank: number,
    // @Query('referencia_pago') refPayment: string,
    @Query() payload: ValidateInvoiceDto,
  ) {
    return {
      ...payload,
    };

    // return enviaMail();
  }

  @Get('/notificacion')
  @HttpCode(200)
  async notificacionFactura(@Query() payload: ValidateInvoiceDto) {
    // return res.send();

    const responsePayment = await this.getStatusInvoicePayment(payload);

    if (!responsePayment)
      throw new NotFoundError('No se encontraron pagos en el banco');

    const registerInvoice = await this.invoiceService.registerPaymentCash(
      responsePayment,
    );

    const respSysRegister =
      await this.invoiceSysService.registerInvoiceSysApolo(
        Number(payload.referencia_pago),
      );

    //TODO: send email and update status

    return respSysRegister;
  }

  @Post('/reverso')
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
        'https://api-colombia.com/api/v1/Departments',
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
        referencia_pago: '6945',
        estado_pago: 1,
        valor_pagado: 220000,
        codigo_transaccion: '1308276574',
        fecha: '01/02/2022 16:13:49',
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
