import { InjectRepository } from '@nestjs/typeorm';
import { IPaymentSearch } from '../../../interfaces/payment.interface';
import { Repository } from 'typeorm';

import { DetailPayment } from '../entities/detailPayment.entity';
import { EEmailStatus, EStatusInvoice } from '../enums/invoice.enum';
import * as moment from 'moment';

export class DetailPaymentRepository extends Repository<DetailPayment> {
  constructor(
    @InjectRepository(DetailPayment)
    private repository: DetailPaymentRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findPaymentsForReverse(payload: IPaymentSearch) {
    const { invoiceId, value, transactionCode } = payload;
    return this.repository
      .createQueryBuilder('pm')
      .where('pm.facturaId = :id', { id: invoiceId })
      .andWhere('pm.estadoPagoId = :estadoPago', {
        estadoPago: EStatusInvoice.PAGO_FINALIZADO_OK,
      })
      .andWhere('pm.codigoTransaccion = :codigoTransaccion', {
        codigoTransaccion: transactionCode,
      })
      .andWhere('pm.valorPago = :valorPago', {
        valorPago: value,
      })
      .getMany();
  }

  findPaymentOkByInvoiceId(invoiceId: number) {
    return this.repository
      .createQueryBuilder('pm')
      .select('pm')
      .innerJoinAndSelect('pm.bankAccount', 'ba')
      .innerJoinAndSelect('pm.formOfPayment', 'fp')
      .where('pm.facturaId = :id', { id: invoiceId })
      .andWhere('pm.estadoPagoId = :estadoPago', {
        estadoPago: EStatusInvoice.PAGO_FINALIZADO_OK,
      })
      .getOne();
  }

  findPaymentsOkByDate(date: Date = new Date(), limit: number = 20) {
    return this.repository
      .createQueryBuilder('pm')
      .select('pm')
      .addSelect([
        'inv.id',
        'inv.estudianteId',
        'inv.isOnline',
        'inv.sysapoloVerify',
        'inv.emailSend',
        'inv.fecha',
      ])
      .innerJoin('pm.invoice', 'inv')
      .innerJoinAndSelect('inv.person', 'per')
      .where('pm.estadoPagoId = :estadoPago', {
        estadoPago: EStatusInvoice.PAGO_FINALIZADO_OK,
      })
      .andWhere('DATE(pm.fecha) = :date', {
        date: moment(date).format('YYYY-MM-DD'),
      })
      .andWhere('inv.emailSend = :sendMail', {
        sendMail: EEmailStatus.PENDIENTE,
      })
      .limit(limit)
      .getMany();
  }
}
