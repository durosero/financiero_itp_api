import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNull, isEmpty } from 'lodash';
import { resolve } from 'path';
import { NotFoundError } from 'src/classes/httpError/notFounError';
import { UnprocessableEntity } from 'src/classes/httpError/unProcessableEntity';
import { getBaseUrl } from 'src/config/environments';
import { IEnrollment, IInfoInvoice } from 'src/interfaces/enrollment.interface';
import {
  IGenerateInvoice,
  IInvicePdfParams,
} from 'src/interfaces/invoice.interface';
import { generarCodigoBarras } from 'src/utils/barcode.util';
import {
  calcularTotales,
  calcularTotalExtraOrdinario,
  createQRBase64,
  generateEndDatePayment,
  llenarSubTotal,
} from 'src/utils/invoice.util';
import {
  compileHBS,
  convertHTMLtoPDF,
  initializeHelpersHbs,
} from 'src/utils/reportPdf.util';
import { DataSource, Repository } from 'typeorm';
import {
  INFO_MATRICULA_SQL,
  INFO_PROGRAMA_SQL,
} from '../constant/invoiceSql.constant';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';
import { DetailInvoice } from '../entities/detailInvoice.entity';
import { UniversityPeriod } from '../entities/univsityPeriod.entity';
import { ECategoryInvoice } from '../enums/invoice.enum';
import { ConfigRepository } from '../repositories/config.repository';
import { DiscountRepository } from '../repositories/discount.repository';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { PackageRepository } from '../repositories/package.repository';
import { ConsultInvoiceService } from './consultInvoice.service';

@Injectable()
export class GenerateInvoiceService {
  constructor(
    private readonly consultInvoiceService: ConsultInvoiceService,
    private readonly packageRepository: PackageRepository,
    private readonly invoiceRepository: InvoiceRepository,

    @InjectRepository(UniversityPeriod)
    private periodRepository: Repository<UniversityPeriod>,

    @InjectRepository(DetailInvoice)
    private detailInvoiceRepository: Repository<DetailInvoice>,

    private readonly dataSource: DataSource,

    private discountRepository: DiscountRepository,
    private configRepository: ConfigRepository,
  ) {}

  async mainGenerateInvoice(payload: GenerateInvoiceDto) {
    const {
      codPaquete,
      matriculaId,
      isPagoOnline,
      total,
      personaId,
      programaPersonaId,
    } = payload;

    const packageInvoce = await this.packageRepository.findConceptsByCode(
      codPaquete,
    );
    if (!packageInvoce) throw new NotFoundError('No se encontro el paquete');

    const queryRunner = this.dataSource.createQueryRunner();

    const [infoMatricula] = !matriculaId
      ? await queryRunner.manager.query<IEnrollment[]>(INFO_PROGRAMA_SQL, [
          personaId,
          programaPersonaId,
        ])
      : await queryRunner.manager.query<IEnrollment[]>(INFO_MATRICULA_SQL, [
          matriculaId,
        ]);

    if (!infoMatricula)
      throw new NotFoundError('No se encontro el programa o la matricula');

    const params: IGenerateInvoice = {
      infoEstudiante: infoMatricula,
      codPaquete,
      matriculaId,
      isPagoOnline,
      total,
      categoriaPagoId: packageInvoce.categoriaId,
    };

    const invoice = this.consultInvoiceService.generateInvoiceByParams(params);
    return invoice;
  }

  async generateAndSaveInvoice(payload: GenerateInvoiceDto) {
    const invoiceNew = await this.mainGenerateInvoice(payload);

    if (!invoiceNew)
      throw new UnprocessableEntity('No se pudo generar la factura');

    const duplicateInvoice = await this.invoiceRepository.findDuplicateInvoice(
      payload.personaId,
      invoiceNew.categoriaPagoId,
    );

    if (duplicateInvoice) {
      await this.detailInvoiceRepository.delete({
        facturaId: duplicateInvoice.id,
      });
    }
    const invoiceSave = this.invoiceRepository.create({
      ...duplicateInvoice,
      ...invoiceNew,
    });

    return this.invoiceRepository.save(invoiceSave);
  }

  async getHtmlInvoice(invoiceId: number): Promise<string> {
    const invoice = await this.invoiceRepository.findById(invoiceId);

    if (!invoice)
      throw new NotFoundError(`No se encontro la factura con id ${invoiceId}`);
    const { jsonResponse, categoryInvoice, detailInvoices, detailPayments } =
      invoice;

    const { info_cliente }: IInfoInvoice = JSON.parse(jsonResponse);

    const packageInvoce = await this.packageRepository.findConceptsByCode(
      invoice.codPaquete,
    );
    if (!packageInvoce) throw new NotFoundError('No se encontro el paquete');

    const { totalOrdinario } = calcularTotales(detailInvoices);
    const totalExtraordinario = calcularTotalExtraOrdinario(
      invoice.detailInvoices,
      packageInvoce,
    );

    const [period, discounts] = await Promise.all([
      this.periodRepository.findOne({
        where: {
          codPeriodo: info_cliente.cod_periodo,
          codColegio: info_cliente.cod_colegio,
        },
      }),
      this.discountRepository.findForEnrollment(
        categoryInvoice.id,
        info_cliente.ide_persona,
        info_cliente.cod_periodo,
      ),
    ]);

    if (!period) throw new NotFoundError('No se encontro el periodo academico');

    invoice.detailInvoices = llenarSubTotal(detailInvoices);

    const url = `${getBaseUrl()}/invoice/generate/pdf/${invoice.id}`;
    const qrBase64 = await createQRBase64(url);

    initializeHelpersHbs();

    if (invoice.categoriaPagoId == ECategoryInvoice.MATRICULA) {
      const barcodeOrd = generarCodigoBarras({
        limitDate: period.fecFinMatOrdinaria,
        reference: invoice.id.toString(),
        value: totalOrdinario,
      });
      const barcodeExtra = generarCodigoBarras({
        limitDate: period.fecFinMatextraord,
        reference: invoice.id.toString(),
        value: totalExtraordinario,
      });

      const dataReport: IInvicePdfParams = {
        ...invoice,
        barcodeOrd: barcodeOrd.barcodeSvg,
        barcodeExt: barcodeExtra.barcodeSvg,
        infoStudent: info_cliente,
        discounts,
        totalOrdinario,
        totalExtraordinario,
        period,
        qrBase64,
        generated: new Date(),
      };
      const pathTemplateBody = resolve(
        __dirname,
        '../../../',
        'templates/facturaMatricula.pdf.hbs',
      );
      return compileHBS(pathTemplateBody, dataReport);
    }

    if (invoice.categoriaPagoId == ECategoryInvoice.INSCRIPCION) {
      const barcodeOrd = generarCodigoBarras({
        limitDate: period.fecFinInsNuevos ?? generateEndDatePayment(),
        reference: invoice.id.toString(),
        value: totalOrdinario,
      });

      const dataReport: IInvicePdfParams = {
        ...invoice,
        barcodeOrd: barcodeOrd.barcodeSvg,
        infoStudent: info_cliente,
        discounts,
        totalOrdinario,
        period,
        qrBase64,
        generated: new Date(),
      };
      const pathTemplateBody = resolve(
        __dirname,
        '../../../',
        'templates/facturaInscripcion.pdf.hbs',
      );
      return compileHBS(pathTemplateBody, dataReport);
    }

    const limitDate = generateEndDatePayment();

    const barcodeOrd = generarCodigoBarras({
      limitDate,
      reference: invoice.id.toString(),
      value: totalOrdinario,
    });

    const dataReport: IInvicePdfParams = {
      ...invoice,
      barcodeOrd: barcodeOrd.barcodeSvg,
      infoStudent: info_cliente,
      totalOrdinario,
      limitDate,
      qrBase64,
      generated: new Date(),
    };
    const pathTemplateBody = resolve(
      __dirname,
      '../../../',
      'templates/facturaGeneral.pdf.hbs',
    );
    return compileHBS(pathTemplateBody, dataReport);
  }

  async getPdfInvoice(invoiceId: number): Promise<Buffer> {
    const templateHtml = await this.getHtmlInvoice(invoiceId);
    const buffer = await convertHTMLtoPDF(templateHtml);
    return buffer;
  }
}
