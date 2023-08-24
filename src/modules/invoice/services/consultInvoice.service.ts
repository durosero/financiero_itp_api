import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty, isNull } from 'lodash';
import { DataSource, Repository } from 'typeorm';
import { NotFoundError } from '../../../classes/httpError/notFounError';
import { UnprocessableEntity } from '../../../classes/httpError/unProcessableEntity';
import {
  IEnrollment,
  IInfoInvoice,
  IStudent
} from '../../../interfaces/enrollment.interface';
import { createDetailInvoice } from '../../../utils/adapters/invoiceAdapter.util';
import {
  calcularTotales,
  generateCodeInvoice,
  generateEndDatePayment
} from '../../../utils/invoice.util';
import {
  INFO_MATRICULA_SQL,
  INFO_PROGRAMA_SQL
} from '../constant/invoiceSql.constant';
import { DetailInvoice } from '../entities/detailInvoice.entity';
import { Invoice } from '../entities/invoice.entity';
import { UniversityPeriod } from '../entities/univsityPeriod.entity';
import {
  ECategoryInvoice,
  EEmailStatus,
  EOnlinePayment,
  EPackageCode,
  EStatusInvoice,
  ESysApoloStatus,
  PACKAGE_TYPE
} from '../enums/invoice.enum';
import { ConfigRepository } from '../repositories/config.repository';
import { DiscountRepository } from '../repositories/discount.repository';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { PackageRepository } from '../repositories/package.repository';

@Injectable()
export class ConsultInvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly packageRepository: PackageRepository,

    private configRepository: ConfigRepository,
    private discountRepository: DiscountRepository,

    @InjectRepository(DetailInvoice)
    private detailInvoiceRepository: Repository<DetailInvoice>,

    @InjectRepository(UniversityPeriod)
    private periodRepository: Repository<UniversityPeriod>,

    private readonly dataSource: DataSource,
  ) {}

  async searchInvoiceForPayment(invoiceId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findFullById(invoiceId);
    if (!invoice) throw new NotFoundError('Factura no encontrada');

    const {
      detailPayments,
      codPaquete,
      matriculaId,
      categoriaPagoId,
      jsonResponse,
    } = invoice;

    if (!isEmpty(detailPayments))
      throw new UnprocessableEntity('Factura ya ha sido pagada');

    const { info_cliente: infoStudet }: IInfoInvoice = JSON.parse(jsonResponse);

    //TODO: update items factura   //verifica si ya existe una factura creada con esa matricula y con ese paquete

    if (categoriaPagoId == ECategoryInvoice.MATRICULA) {
      return await this.generateInvoiceEnrrolment(matriculaId);
    }

    if (categoriaPagoId == ECategoryInvoice.INSCRIPCION) {
      return await this.generateInvoiceRegistration(matriculaId);
    }

    return await this.generateInvoiceOtherByStudent(infoStudet, codPaquete);
  }

  async generateInvoiceOtherByStudent(
    infoMatricula: IStudent,
    packageCode: string,
  ): Promise<Invoice> {
    const config = await this.configRepository.getCurrentConfig();
    if (!config) throw new NotFoundError('No se encontro la configuracion');

    const packageInvoce = await this.packageRepository.findConceptsByCode(
      packageCode,
    );
    if (!packageInvoce) throw new NotFoundError('No se encontro el paquete');

    const { packageDetail, categoriaId } = packageInvoce;

    const discounts = await this.discountRepository.findForInvoiceGeneral(
      categoriaId,
      infoMatricula.ide_persona,
    );

    let aumentoExtra: number = discounts
      .filter((discount) => discount.accion == '0')
      .reduce((a, b) => a + b.porcentaje, 0);

    let descuentoExtra: number = discounts
      .filter((discount) => discount.accion == '1')
      .reduce((a, b) => a + b.porcentaje, 0);
    const detailInvoice = this.detailInvoiceRepository.create(
      createDetailInvoice(packageDetail, aumentoExtra, descuentoExtra),
    );
    const { totalExtraordinario: total } = calcularTotales(detailInvoice);
    return this.invoiceRepository.create({
      estadoId: EStatusInvoice.PAGO_INICADO,
      estudianteId: infoMatricula.ide_persona,
      codigo: generateCodeInvoice(infoMatricula),
      matriculaId: null,
      valor: total,
      periodoId: infoMatricula.cod_periodo,
      codPaquete: EPackageCode.INSCRIPCION,
      isOnline: EOnlinePayment.NO,
      categoriaPagoId: categoriaId,
      fechaUpdate: new Date(),
      fechaLimite: generateEndDatePayment(),
      sysapoloVerify: ESysApoloStatus.PENDIENTE,
      emailSend: EEmailStatus.PENDIENTE,
      detailInvoices: detailInvoice,
    });
  }

  async generateInvoiceOther(
    estudianteId: string,
    packageCode: string,
    idProgramaPersona: number,
  ): Promise<Invoice> {
    const queryRunner = this.dataSource.createQueryRunner();
    const [infoMatricula] = await queryRunner.manager.query<IEnrollment[]>(
      INFO_PROGRAMA_SQL,
      [estudianteId, idProgramaPersona],
    );
    if (!infoMatricula) throw new NotFoundError('No se encontro el programa');

    const config = await this.configRepository.getCurrentConfig();
    if (!config) throw new NotFoundError('No se encontro la configuracion');

    const packageInvoce = await this.packageRepository.findConceptsByCode(
      packageCode,
    );
    if (!packageInvoce) throw new NotFoundError('No se encontro el paquete');

    const { packageDetail, categoriaId } = packageInvoce;

    const discounts = await this.discountRepository.findForInvoiceGeneral(
      categoriaId,
      infoMatricula.ide_persona,
    );

    let aumentoExtra: number = discounts
      .filter((discount) => discount.accion == '0')
      .reduce((a, b) => a + b.porcentaje, 0);

    let descuentoExtra: number = discounts
      .filter((discount) => discount.accion == '1')
      .reduce((a, b) => a + b.porcentaje, 0);
    const detailInvoice = this.detailInvoiceRepository.create(
      createDetailInvoice(packageDetail, aumentoExtra, descuentoExtra),
    );
    const { totalExtraordinario: total } = calcularTotales(detailInvoice);
    return this.invoiceRepository.create({
      estadoId: EStatusInvoice.PAGO_INICADO,
      estudianteId: infoMatricula.ide_persona,
      codigo: generateCodeInvoice(infoMatricula),
      matriculaId: null,
      valor: total,
      periodoId: infoMatricula.cod_periodo,
      codPaquete: EPackageCode.INSCRIPCION,
      isOnline: EOnlinePayment.NO,
      categoriaPagoId: categoriaId,
      fechaUpdate: new Date(),
      sysapoloVerify: ESysApoloStatus.PENDIENTE,
      fechaLimite: generateEndDatePayment(),
      emailSend: EEmailStatus.PENDIENTE,
      detailInvoices: detailInvoice,
    });
  }

  async generateInvoiceRegistration(matriculaId: number): Promise<Invoice> {
    const queryRunner = this.dataSource.createQueryRunner();

    const [infoMatricula] = await queryRunner.manager.query<IEnrollment[]>(
      INFO_MATRICULA_SQL,
      [matriculaId],
    );
    if (!infoMatricula) throw new NotFoundError('No se encontro la matricula');

    const config = await this.configRepository.getCurrentConfig();
    if (!config) throw new NotFoundError('No se encontro la configuracion');

    const packageInvoce = await this.packageRepository.findConceptsByCode(
      EPackageCode.INSCRIPCION,
    );
    if (!packageInvoce) throw new NotFoundError('No se encontro el paquete');

    const { packageDetail, categoriaId } = packageInvoce;

    const [period, discounts] = await Promise.all([
      this.periodRepository.findOne({
        where: {
          codPeriodo: infoMatricula.cod_periodo,
          codColegio: infoMatricula.cod_colegio,
        },
      }),
      this.discountRepository.findForEnrollment(
        categoriaId,
        infoMatricula.ide_persona,
        infoMatricula.cod_periodo,
      ),
    ]);

    if (!period) throw new NotFoundError('No se encontro el periodo academico');

    const { fecFinInsNuevos } = period;

    let aumentoExtra: number = discounts
      .filter((discount) => discount.accion == '0')
      .reduce((a, b) => a + b.porcentaje, 0);

    let descuentoExtra: number = discounts
      .filter((discount) => discount.accion == '1')
      .reduce((a, b) => a + b.porcentaje, 0);
    const detailInvoice = this.detailInvoiceRepository.create(
      createDetailInvoice(packageDetail, aumentoExtra, descuentoExtra),
    );
    const { totalExtraordinario: total } = calcularTotales(detailInvoice);
    return this.invoiceRepository.create({
      estadoId: EStatusInvoice.PAGO_INICADO,
      estudianteId: infoMatricula.ide_persona,
      codigo: generateCodeInvoice(infoMatricula),
      matriculaId: matriculaId,
      valor: total,
      periodoId: infoMatricula.cod_periodo,
      codPaquete: EPackageCode.INSCRIPCION,
      isOnline: EOnlinePayment.NO,
      categoriaPagoId: categoriaId,
      fechaUpdate: new Date(),
      fechaLimite: fecFinInsNuevos ?? generateEndDatePayment(),
      sysapoloVerify: ESysApoloStatus.PENDIENTE,
      emailSend: EEmailStatus.PENDIENTE,
      detailInvoices: detailInvoice,
    });
  }

  async generateInvoiceEnrrolment(matriculaId: number): Promise<Invoice> {
    const queryRunner = this.dataSource.createQueryRunner();

    const [infoMatricula] = await queryRunner.manager.query<IEnrollment[]>(
      INFO_MATRICULA_SQL,
      [matriculaId],
    );
    if (!infoMatricula) throw new NotFoundError('No se encontro la matricula');

    const config = await this.configRepository.getCurrentConfig();
    if (!config) throw new NotFoundError('No se encontro la configuracion');

    let quantity = 0;
    let codPaquete: string = '0';
    if (
      infoMatricula.nro_creditos > config.minCreditos ||
      infoMatricula.nro_creditos == 0
    ) {
      codPaquete = PACKAGE_TYPE.COMPLETO[infoMatricula.cod_nivel_edu];
    } else {
      codPaquete = PACKAGE_TYPE.INDIVIDUAL[infoMatricula.cod_nivel_edu];
      quantity = infoMatricula.nro_creditos;
    }

    const packageInvoce = await this.packageRepository.findConceptsByCode(
      codPaquete,
    );
    if (!packageInvoce) throw new NotFoundError('No se encontro el paquete');

    const { packageDetail, categoriaId } = packageInvoce;

    const [period, discounts] = await Promise.all([
      this.periodRepository.findOne({
        where: {
          codPeriodo: infoMatricula.cod_periodo,
          codColegio: infoMatricula.cod_colegio,
        },
      }),
      this.discountRepository.findForEnrollment(
        categoriaId,
        infoMatricula.ide_persona,
        infoMatricula.cod_periodo,
      ),
    ]);

    if (!period) throw new NotFoundError('No se encontro el periodo academico');

    const { fecIniMatextraord, fecFinMatextraord, fecFinMatOrdinaria } = period;
    const currenDate = new Date();

    let aumentoExtra: number = discounts
      .filter((discount) => discount.accion == '0')
      .reduce((a, b) => a + b.porcentaje, 0);

    let descuentoExtra: number = discounts
      .filter((discount) => discount.accion == '1')
      .reduce((a, b) => a + b.porcentaje, 0);

    if (
      currenDate.getTime() >= fecIniMatextraord.getTime() &&
      !isNull(fecIniMatextraord)
    ) {
      aumentoExtra = aumentoExtra + config.porcentajeExt;
    }

    const detailInvoice = this.detailInvoiceRepository.create(
      createDetailInvoice(
        packageDetail,
        aumentoExtra,
        descuentoExtra,
        quantity,
      ),
    );
    const { totalExtraordinario: total } = calcularTotales(detailInvoice);
    return this.invoiceRepository.create({
      estadoId: EStatusInvoice.PAGO_INICADO,
      estudianteId: infoMatricula.ide_persona,
      codigo: generateCodeInvoice(infoMatricula),
      matriculaId: matriculaId,
      valor: total,
      periodoId: infoMatricula.cod_periodo,
      codPaquete,
      fechaLimite: fecFinMatextraord ?? fecFinMatOrdinaria,
      isOnline: EOnlinePayment.NO,
      categoriaPagoId: categoriaId,
      fechaUpdate: new Date(),
      sysapoloVerify: ESysApoloStatus.PENDIENTE,
      emailSend: EEmailStatus.PENDIENTE,
      detailInvoices: detailInvoice,
    });
  }
}
