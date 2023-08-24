import { InjectRepository } from '@nestjs/typeorm';
import { IPaymentSearch } from '../../../interfaces/payment.interface';
import { Repository } from 'typeorm';

import { DetailPayment } from '../entities/detailPayment.entity';
import { EStatusInvoice } from '../enums/invoice.enum';

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
}
