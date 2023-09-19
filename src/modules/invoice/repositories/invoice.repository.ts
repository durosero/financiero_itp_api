import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import {
  EEmailStatus,
  EOnlinePayment,
  EStatusInvoice,
  ESysApoloStatus,
} from '../enums/invoice.enum';

export class InvoiceRepository extends Repository<Invoice> {
  constructor(
    @InjectRepository(Invoice)
    private repository: InvoiceRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findById(invoiceId: number) {
    return this.repository
      .createQueryBuilder('inv')
      .select([
        'inv.id',
        'inv.codigoBarras',
        'inv.estadoId',
        'inv.jsonResponse',
        'inv.estudianteId',
        'inv.categoriaPagoId',
        'inv.matriculaId',
        'inv.codPaquete',
        'inv.valor',
      ])
      .innerJoinAndSelect('inv.person', 'per')
      .innerJoinAndSelect('per.documentType', 'dt')
      .innerJoinAndSelect('inv.detailInvoices', 'dtIv')
      .leftJoinAndSelect('inv.detailPayments', 'dtPay')
      .leftJoinAndSelect('dtPay.statusPayment', 'stp')
      .innerJoinAndSelect('dtIv.concept', 'cnp')
      .leftJoinAndSelect('inv.categoryInvoice', 'invCat')
      .where('inv.id = :invoiceId', { invoiceId })
      .getOne();
  }

  findFullById(invoiceId: number) {
    return this.repository
      .createQueryBuilder('inv')
      .select([
        'inv.id',
        'inv.codigoBarras',
        'inv.estadoId',
        'inv.jsonResponse',
        'inv.estudianteId',
        'inv.fechaUpdate',
        'inv.categoriaPagoId',
        'inv.matriculaId',
        'inv.codPaquete',
      ])
      .innerJoinAndSelect('inv.detailInvoices', 'dtIv')
      .innerJoinAndSelect('inv.detailPayments', 'dtPay')
      .innerJoinAndSelect('dtIv.concept', 'cnp')
      .leftJoinAndSelect('inv.categoryInvoice', 'invCat')
      .innerJoinAndSelect('dtPay.formOfPayment', 'frPI')
      .innerJoinAndSelect('dtPay.statusPayment', 'stp')
      .where('inv.id = :invoiceId', { invoiceId })
      .andWhere('dtPay.estadoPagoId = :estadoPago', {
        estadoPago: EStatusInvoice.PAGO_FINALIZADO_OK,
      })
      .getOne();
  }

  updateStatusVerifySys(status: ESysApoloStatus, invoiceId: number) {
    const invoice: DeepPartial<Invoice> = {
      sysapoloVerify: status,
      fechaUpdate: new Date(),
    };
    return this.repository
      .createQueryBuilder()
      .update(Invoice)
      .set(invoice)
      .where({ id: invoiceId })
      .execute();
  }

  updateStatusEmailSend(status: EEmailStatus, invoiceId: number) {
    const invoice: DeepPartial<Invoice> = {
      emailSend: status,
      fechaUpdate: new Date(),
    };
    return this.repository
      .createQueryBuilder()
      .update(Invoice)
      .set(invoice)
      .where({ id: invoiceId })
      .execute();
  }

  deleteInvoices() {
    return (
      this.repository
        .createQueryBuilder('inv')
        .select(['inv.id', 'inv.fechaUpdate'])
        .leftJoin('inv.detailPayments', 'dtPay')
        .where('dtPay.id IS NULL')
        .andWhere('DATEDIFF(NOW(),inv.fecha_update) >=3')
        // .limit(5)
        .getMany()
        .then((invoices) => {
          return this.repository.remove(invoices);
        })
    );
  }

  getPaidInvoiceLimit(limit: number = 10) {
    return this.repository
      .createQueryBuilder('inv')
      .select(['inv.id'])
      .innerJoinAndSelect('inv.detailPayments', 'dtPay')
      .innerJoinAndSelect('dtPay.statusPayment', 'stp')
      .where('dtPay.estadoPagoId = :estadoPago', {
        estadoPago: EStatusInvoice.PAGO_FINALIZADO_OK,
      })
      .andWhere('inv.sysapoloVerify = :statusSys', {
        statusSys: ESysApoloStatus.PENDIENTE,
      })
      .andWhere('YEAR(dtPay.fecha)=YEAR(NOW())')
      .limit(limit)
      .getMany();
  }

  async findInvoicesCash(limit: number = 300) {
    const payments = await this.repository
      .createQueryBuilder('inv')
      .innerJoinAndSelect('inv.detailPayments', 'dtPay')
      .where('dtPay.estadoPagoId = :estadoPago', {
        estadoPago: EStatusInvoice.PAGO_FINALIZADO_OK,
      })
      .andWhere('DATEDIFF(NOW(),dtPay.fecha) <=3')
      .groupBy('inv.id')
      .getMany();

    const ids = payments.flatMap(({ detailPayments }) => {
      return detailPayments.map(({ facturaId }) => facturaId);
    });

    return this.repository
      .createQueryBuilder('inv')
      .select(['inv.id', 'inv.fecha'])
      .innerJoinAndSelect('inv.person', 'per')
      .innerJoinAndSelect('per.documentType', 'dt')
      .innerJoinAndSelect('inv.detailInvoices', 'dtIv')
      .leftJoinAndSelect('inv.detailPayments', 'dtPay')
      .innerJoinAndSelect('dtIv.concept', 'cnp')
      .where('inv.isOnline = :online', {
        online: EOnlinePayment.NO,
      })
      .andWhere('DATEDIFF(NOW(),inv.fecha) <=3')
      .andWhere({ id: In(ids) })
      .orderBy('inv.fecha', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findDuplicateInvoice(
    clientId: string,
    categoryId: number,
  ): Promise<Invoice> {
    const result = await this.repository
      .createQueryBuilder('inv')
      .select('inv')
      .leftJoinAndSelect('inv.detailPayments', 'dtPay')
      .where('inv.estudianteId = :clientId', {
        clientId,
      })
      .andWhere('inv.categoriaPagoId = :categoryId', { categoryId })
      .andWhere('DATEDIFF(NOW(),inv.fecha) <=30')
      .orderBy('inv.fecha', 'DESC')
      .getMany();

    for (const invoice of result) {
      const paid = invoice.detailPayments.some(
        (payment) => payment.estadoPagoId == EStatusInvoice.PAGO_FINALIZADO_OK,
      );
      if (!paid) return invoice;
    }
    return undefined;
  }
}
