import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { getBaseUrl } from 'src/config/environments';
import { IInvoiceResponse } from 'src/interfaces/invoice.interface';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { GenerateInvoiceService } from './services/generateInvoice.service';
import { isOnlinePay } from '../../utils/invoice.util';
import { InvoiceService } from './services/invoice.service';
import { InvoiceSysService } from './services/invoiceSys.service';
import { SendPaymentDto } from './dto/send-payment.dto';
import { EnrollmentService } from './services/enrollment.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly sysApoloService: InvoiceSysService,
    private readonly generateInvoiceService: GenerateInvoiceService,
    private readonly enrollmentService: EnrollmentService,
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

  @Post('send/payment/:id')
  async sendPaymentEmail(
    @Param('id', ParseIntPipe) invoiceId: number,
    @Body() payload: SendPaymentDto,
  ) {
    return this.invoiceService.sendPaymentEmail(invoiceId, payload.important);
  }

  @Get('info/:id')
  async getInfoInvoice(@Param('id', ParseIntPipe) invoiceId: number) {
    const { jsonResponse, ...rest } = await this.invoiceService.getInfoInvoice(
      invoiceId,
    );
    return {
      jsonResponse: JSON.parse(jsonResponse),
      ...rest,
    };
  }

  @Post('generate')
  async generateInvoice(@Body() payload: GenerateInvoiceDto) {
    const { jsonResponse, ...rest } =
      await this.generateInvoiceService.mainGenerateInvoice(payload);
    return {
      jsonResponse: JSON.parse(jsonResponse),
      ...rest,
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

  @Get('studenttype')
  async getStudentType(@Query('matriculaId') matriculaId: number) {
    return this.enrollmentService.getDatesStudentType(matriculaId);
  }

  @Get('sysapolo/send-bulk')
  async registerSysApoloMasive() {
    return this.sysApoloService.registerInvoiceMasive();
  }
}
