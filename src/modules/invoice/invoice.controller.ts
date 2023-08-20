import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('payment/pdf/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=file.pdf')
  async getPdfPaymentReceipt(@Param('id') invoiceId: number) {
    const buffer = await this.invoiceService.getPdfPaymentReceipt(invoiceId);
    return new StreamableFile(buffer);
  }

  @Get('payment/html/:id')
  @Header('content-type', 'text/html')
  async getHTMLPaymentReceipt(@Param('id') invoiceId: number) {
    return this.invoiceService.getHTMLPaymentReceipt(invoiceId);
  }
  @Get('payment/email/:id')

  async getEmail(@Param('id') invoiceId: number) {
    return this.invoiceService.equide(invoiceId);
  }
}
