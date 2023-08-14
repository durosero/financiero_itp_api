import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  Req,
  Res,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { query, Response } from 'express';
import { ValidateInvoiceDto } from './dto/validate-invoice.dto';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import { MESSAGE_RESPONSE } from './constant/invoice.constant';
import { ESeverity } from './enums/invoice.enum';

@Controller('caja')
export class CashController {
  constructor(private readonly invoiceService: InvoiceService) {}

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
  notificacionFactura(
    @Query() payload: ValidateInvoiceDto,
    @Res() res: Response,
  ) {
    return res.send();
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
}
