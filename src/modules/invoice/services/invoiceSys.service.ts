import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { NotFoundError } from '../../../classes/httpError/notFounError';
import { UnprocessableEntity } from '../../../classes/httpError/unProcessableEntity';

import { DeepPartial, EntityManager, QueryRunner, Repository } from 'typeorm';
import { IInfoInvoice } from '../../../interfaces/enrollment.interface';
import { IDescriptionSys } from '../../../interfaces/payment.interface';
import {
  calcularSubTotal,
  generateDescriptionSys,
} from '../../../utils/invoice.util';
import { getVerificationGigit } from '../../../utils/nitConverter.util';
import {
  COD_DET_FACTURA_SQL,
  COD_FACTURA_SQL,
  COD_TERCERO_SQL,
} from '../constant/invoiceSql.constant';

import { Invoice } from '../entities/invoice.entity';
import { Person } from '../entities/person.entity';
import { DetailInvoiceSys } from '../entities/SysApolo/detailInvoiceSys.entity';
import { InvoiceSys } from '../entities/SysApolo/invoiceSys.entity';
import { PaymentPointSys } from '../entities/SysApolo/paymentPointSys.entity';
import { ThirdPartySys } from '../entities/SysApolo/thirdPartySys.entity';
import { ESysApoloStatus } from '../enums/invoice.enum';
import { databaseProviders } from '../providers/database.provider';
import { DetailPaymentRepository } from '../repositories/detailPayment.repository';
import { InvoiceRepository } from '../repositories/invoice.repository';

@Injectable()
export class InvoiceSysService {
  private invoiceSysRepository: Repository<InvoiceSys>;
  private detailInvoiceSysRepository: Repository<DetailInvoiceSys>;
  private thirdPartySysRepository: Repository<ThirdPartySys>;
  private paymentPointSysRepository: Repository<PaymentPointSys>;

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly detailPaymentRepository: DetailPaymentRepository,
  ) {
    databaseProviders.useFactory().then(
      (dataSource) => {
        this.invoiceSysRepository = dataSource.getRepository(InvoiceSys);
        this.detailInvoiceSysRepository =
          dataSource.getRepository(DetailInvoiceSys);
        this.thirdPartySysRepository = dataSource.getRepository(ThirdPartySys);
        this.paymentPointSysRepository =
          dataSource.getRepository(PaymentPointSys);
      },
      () => null,
    );
  }

  // Main register Invoice
  async registerInvoiceSysApolo(invoiceIdParam: number): Promise<boolean> {
    const dataSource = await databaseProviders.useFactory();
    const queryRunner = dataSource.createQueryRunner();
    try {
      const invoice = await this.invoiceRepository.findById(invoiceIdParam);
      if (!invoice) throw new NotFoundError('Factura no encontrada');

      const { person, id: invoiceId } = invoice;
      let codTer: string = '00000';

      const [invoiceSys] = await this.invoiceSysRepository?.find({
        where: { numRecibo: invoiceId },
      });

      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (invoiceSys) {
        this.invoiceRepository.updateStatusVerifySys(
          ESysApoloStatus.REGISTRADO,
          invoiceId,
        );
        throw new UnprocessableEntity(
          `La factura ${invoiceId} ya se encuentra en sysApolo`,
        );
      }

      const [thirdParty] = await this.thirdPartySysRepository?.find({
        where: { numIdentificacion: invoice.estudianteId },
      });

      if (!thirdParty) {
        codTer = await this.createThirdParty(queryRunner.manager, person);
      } else {
        await this.updateThirdParty(queryRunner, person);
        codTer = thirdParty.id;
      }

      await this.createInvoiceSys(queryRunner, invoice, codTer);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      this.invoiceRepository.updateStatusVerifySys(
        ESysApoloStatus.REGISTRADO,
        invoiceId,
      );
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return false;
    }
  }

  async updateThirdParty(dbSys: QueryRunner, person: Person | null) {
    const { documentType, apellido1, apellido2, nombre1, nombre2 } = person;
    const fullName = `${apellido1} ${apellido2 ?? ''} ${nombre1} ${
      nombre2 ?? ''
    }`;
    const thirdPartyUpdate: DeepPartial<ThirdPartySys> = {
      idTipoIdentificacion: documentType.codSysapolo,
      email: person.email,
      nomTercero: fullName.trim(),
      priApellido: apellido1,
      segApellido: apellido2 ?? '',
      priNombre: nombre1,
      otrNombre: nombre2 ?? '',
      dirTercero: person.direccion,
      telTercero: person.phone,
      ideMun: person.codMunicipio,
    };

    await dbSys.manager
      .createQueryBuilder()
      .update(ThirdPartySys)
      .set(thirdPartyUpdate)
      .where('numIdentificacion = :id', { id: person.id })
      .execute();
  }

  async createInvoiceSys(dbSys: QueryRunner, invoice: Invoice, codTer: string) {
    const { jsonResponse, categoryInvoice, detailInvoices } = invoice;
    const { info_cliente: infoStudet }: IInfoInvoice = JSON.parse(jsonResponse);

    const payment = await this.detailPaymentRepository.findPaymentOkByInvoiceId(
      invoice.id,
    );

    if (!payment) throw new NotFoundError('No se encontro pagos en la factura');

    const { bankAccount } = payment;

    const [paymentPoint] = await this.paymentPointSysRepository?.find({
      where: {
        numCuentaBanco: bankAccount.cuentaBanco,
        anioPuntoPago: moment(payment.fecha).year(),
      },
    });

    if (!paymentPoint)
      throw new NotFoundError('No se encontro el punto de pago en sysAPolo');

    const codInvoiceQuery = await this.invoiceSysRepository?.query(
      COD_FACTURA_SQL,
    );

    const codDetInvoiceQuery = await this.invoiceSysRepository?.query(
      COD_DET_FACTURA_SQL,
    );

    if (isEmpty(codInvoiceQuery) || isEmpty(codDetInvoiceQuery))
      throw new NotFoundError('No se ha podido generar el codigo');

    const dataDescriptiom: IDescriptionSys = {
      category: categoryInvoice.descripcion,
      formPayment: payment.formOfPayment.descripcion,
      program: infoStudet.nom_nivel_educativo,
      transactionCode: payment.codigoTransaccion,
      datePayment: moment(payment.fecha).format('YYYY-MM-DD HH:mm:ss'),
    };

    const invoiceSys: DeepPartial<InvoiceSys> = {
      id: codInvoiceQuery[0].cod_factura ?? null,
      numRecibo: invoice.id,
      fecRecibo: payment.fecha,
      codTercero: codTer,
      ideUsuario: 41, //always 41
      detRecibo: generateDescriptionSys(dataDescriptiom),
      valorConcepto: payment.valorPago,
      valorRecaudo: payment.valorPago,
      pagado: 'N',
      ideBanco: 2, //TODO: puntos de pago
      codColegio: infoStudet.cod_colegio,
      codFormaPago: payment.formaPagoId,
      codNivelEducativo: infoStudet.cod_nivel_educativo,
      codPuntoPago: paymentPoint.id,
      creaRegistro: '1',
    };

    const insertInvoice = dbSys.manager.create(InvoiceSys, invoiceSys);

    await dbSys.manager.insert(InvoiceSys, insertInvoice);
    let idDet = codDetInvoiceQuery[0].cod_det_factura ?? 0;
    const inserDetailInvoice = detailInvoices.map<
      DeepPartial<DetailInvoiceSys>
    >((detail) => {
      const {
        cantidad,
        concept: { codSysapolo },
        valorUnidad,
      } = detail;
      idDet++;
      return {
        id: idDet,
        facturaId: codInvoiceQuery[0].cod_factura ?? null,
        conceptoId: codSysapolo,
        cantidad,
        valorConcepto: valorUnidad,
        subTotal: calcularSubTotal(detail),
        idContabilidadDebitoCausacion: -1,
        idContabilidadCreditoCausacion: -1,
        idEncabezadoContabilidadCausacion: -1,
        idContabilidadDebitoRecaudo: -1,
        idContabilidadCreditoRecaudo: -1,
        idEncabezadoContabilidadRecaudo: -1,
        idePresupuestoRecurso: -1,
        codCentroCostoDebCausacion: '-1',
        codCentroCostoCreCausacion: '-1',
        codCentroCostoDebRecaudo: '-1',
        codCentroCostoCreRecaudo: '-1',
      };
    });

    await dbSys.manager.insert(DetailInvoiceSys, inserDetailInvoice);
  }

  async createThirdParty(
    dbSys: EntityManager,
    person: Person,
  ): Promise<string> {
    const { documentType, apellido1, apellido2, nombre1, nombre2 } = person;

    const codTerSql = await this.thirdPartySysRepository?.query(
      COD_TERCERO_SQL,
    );

    if (isEmpty(codTerSql))
      throw new NotFoundError('No se ha podido generar el codigo');

    const digVer = getVerificationGigit(person.id);
    const codTer: string = codTerSql[0].cod_ter ?? '00000';

    const fullName = `${apellido1} ${apellido2 ?? ''} ${nombre1} ${
      nombre2 ?? ''
    }`;

    const thirdPartyCreate: DeepPartial<ThirdPartySys> = {
      id: codTer,
      idTipoIdentificacion: documentType.codSysapolo,
      nitTercero: `${person.id}-${digVer}`,
      numIdentificacion: person.id,
      digVerificacion: digVer,
      email: person.email,
      nomTercero: fullName.trim(),
      priApellido: apellido1,
      segApellido: apellido2 ?? '',
      priNombre: nombre1,
      otrNombre: nombre2 ?? '',
      claTercero: 'S',
      dirTercero: person.direccion,
      telTercero: person.phone,
      ideMun: person.codMunicipio,
      sexTercero: person.genero,
      estTercero: '1',
      fecIngreso: new Date(),
      salarioMensual: 0,
      tipTercero: '4',
    };
    await dbSys.insert(ThirdPartySys, thirdPartyCreate);
    return codTer;
  }

  async deleteInvoiceSysApolo(invoiceId: number): Promise<boolean> {
    try {
      const [invoiceSys] = await this.invoiceSysRepository?.find({
        where: { numRecibo: invoiceId },
      });
      await this.detailInvoiceSysRepository?.delete({
        facturaId: invoiceSys.id,
      });
      await this.invoiceSysRepository?.delete({ id: invoiceSys.id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
