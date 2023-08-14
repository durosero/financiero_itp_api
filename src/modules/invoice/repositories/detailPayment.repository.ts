import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ReversePaymentDto } from '../dto/reverse-payment.dto';
import { DetailPayment } from '../entities/detailPayment.entity';
import { EStatusInvoice } from '../enums/invoice.enum';

export class DetailPaymentRepository extends Repository<DetailPayment> {
  constructor(
    @InjectRepository(DetailPayment)
    private repository: DetailPaymentRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findPaymentsForReverse(payload: ReversePaymentDto) {
    return this.repository
      .createQueryBuilder('pm')
      .where('pm.pago_id = :id', { id: payload.referencia_pago })
      .andWhere('pm.estado_pago_id = :estadoPago', {
        estadoPago: EStatusInvoice.PAGO_FINALIZADO_OK,
      })
      .andWhere('pm.codigo_transaccion = :codigoTransaccion', {
        codigoTransaccion: payload.id_transaccion,
      })
      .andWhere('pm.valor_pago = :valorPago', {
        valorPago: payload.valor_pagado,
      })
      .getMany();
  }

  detetePaymentsByIds(ids: string[]) {
    return this.repository
      .createQueryBuilder('pm')
      .delete()
      .where({
        id: In(ids),
      })
      .execute();
  }
}
