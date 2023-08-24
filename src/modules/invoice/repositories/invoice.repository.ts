import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import {
  EEmailStatus,
  EStatusInvoice,
  ESysApoloStatus
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
      ])
      .innerJoinAndSelect('inv.person', 'per')
      .innerJoinAndSelect('per.documentType', 'dt')
      .innerJoinAndSelect('inv.detailInvoices', 'dtIv')
      .leftJoinAndSelect('inv.detailPayments', 'dtPay')
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

  async updateStatusVerifySys(status: ESysApoloStatus, invoiceId: number) {
    const invoice: DeepPartial<Invoice> = {
      sysapoloVerify: status,
      fechaUpdate: new Date(),
    };
    await this.repository
      .createQueryBuilder()
      .update(Invoice)
      .set(invoice)
      .where({ id: invoiceId })
      .execute();
  }

  async updateStatusEmailSend(status: EEmailStatus, invoiceId: number) {
    const invoice: DeepPartial<Invoice> = {
      emailSend: status,
      fechaUpdate: new Date(),
    };
    await this.repository
      .createQueryBuilder()
      .update(Invoice)
      .set(invoice)
      .where({ id: invoiceId })
      .execute();
  }
}
