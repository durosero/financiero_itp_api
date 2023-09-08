import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import * as moment from 'moment';
import { IPaymentSearch } from 'src/interfaces/payment.interface';
import { getStatusInvoicePaymentWs } from 'src/utils/webService.util';
import { NotFoundError } from '../../classes/httpError/notFounError';
import {
  EResponseDescription,
  EResposeStatusCode,
  IResponseInvoice,
} from '../../interfaces/responseInvoice.interface';
import { MESSAGE_RESPONSE_REVERSE } from './constant/invoice.constant';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import { ValidateInvoiceDto } from './dto/validate-invoice.dto';
import { ESeverity } from './enums/invoice.enum';
import { InvoiceRepository } from './repositories/invoice.repository';
import { ConsultInvoiceService } from './services/consultInvoice.service';
import { InvoiceService } from './services/invoice.service';
import { InvoiceSysService } from './services/invoiceSys.service';
@Controller('caja')
export class PopularCashController {
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

    const registerInvoice = await this.invoiceService.registerPaymentCash(
      responsePayment,
      invoice,
    );

    this.invoiceSysService.registerInvoiceSysApolo(invoice.id);

    return res.send();
  }

  @Post('/reverso')
  @HttpCode(200)
  async reversoFactura(@Body() payload: ReversePaymentDto) {
    const status = await this.invoiceService.reversePayment(payload);

    const response = {
      codigo_estado: status,
      severidad: Object.values(ESeverity)[status],
      descripcion: MESSAGE_RESPONSE_REVERSE[status],
    };

    return response;
  }
}
