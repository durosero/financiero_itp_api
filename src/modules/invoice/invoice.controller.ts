import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { getBaseUrl } from 'src/config/environments';
import { IInvoiceResponse } from 'src/interfaces/invoice.interface';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { ConsultInvoiceService } from './services/consultInvoice.service';
import { GenerateInvoiceService } from './services/generateInvoice.service';

import { InvoiceService } from './services/invoice.service';
import { InvoiceSysService } from './services/invoiceSys.service';
import { isOnlinePay } from '../../utils/invoice.util';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly sysApoloService: InvoiceSysService,
    private readonly generateInvoiceService: GenerateInvoiceService,
    private readonly consultInvoiceService: ConsultInvoiceService,
  ) {}

  @Get('payment/pdf/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=file.pdf')
  async getPdfPaymentReceipt(@Param('id', ParseIntPipe) invoiceId: number) {
    const buffer = await this.invoiceService.getPdfPaymentReceipt(invoiceId);
    return new StreamableFile(buffer);
  }

  @Get('payment/html/:id')
  @Header('content-type', 'text/html')
  async getHTMLPaymentReceipt(@Param('id', ParseIntPipe) invoiceId: number) {
    return this.invoiceService.getHTMLPaymentReceipt(invoiceId);
  }

  @Get('register/sysapolo/:id')
  async registerInvoiceSysApolo(@Param('id', ParseIntPipe) invoiceId: number) {
    return this.sysApoloService.registerInvoiceSysApolo(invoiceId);
  }

  @Get('info/:id')
  async getInfoInvoice(@Param('id', ParseIntPipe) invoiceId: number) {
    const invoiceDB = await this.invoiceService.getInfoInvoice(invoiceId);
    return invoiceDB;
  }

  @Post('generate')
  async generateInvoice(@Body() payload: GenerateInvoiceDto) {
    const { jsonResponse, ...rest } =
      await this.generateInvoiceService.mainGenerateInvoice(payload);
    return {
      ...rest,
      jsonResponse: JSON.parse(jsonResponse),
    };
  }

  @Post('create')
  async createInvoice(
    @Body() payload: GenerateInvoiceDto,
  ): Promise<IInvoiceResponse> {
    try {
      const { isOnline, id } =
        await this.generateInvoiceService.generateAndSaveInvoice(payload);

      return {
        redirectPayment: isOnlinePay(isOnline)
          ? null
          : `${getBaseUrl()}/invoice/pdf/${id}`,
        error: false,
        message: 'Ejecucion correcta',
        invoiceId: id,
      };
    } catch (error) {
      console.log(error);
      return {
        redirectPayment: null,
        error: true,
        message: error?.message,
      };
    }
  }

  @Get('pdf/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=file.pdf')
  async generateInvoicePdf(@Param('id', ParseIntPipe) invoiceId: number) {
    const buffer = await this.generateInvoiceService.getPdfInvoice(invoiceId);
    return new StreamableFile(buffer);
  }

  @Get('html/:id')
  @Header('content-type', 'text/html')
  async generateInvoiceHtml(@Param('id', ParseIntPipe) invoiceId: number) {
    return this.generateInvoiceService.getHtmlInvoice(invoiceId);
  }
}
