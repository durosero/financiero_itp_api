import {
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';

import { InvoiceService } from './services/invoice.service';
import { InvoiceSysService } from './services/invoiceSys.service';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly sysApoloService: InvoiceSysService,
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
}
