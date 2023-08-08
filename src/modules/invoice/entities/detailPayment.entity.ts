import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FormOfPayment } from './formOfPayment.entity';
import { Invoice } from './invoice.entity';
import { StatusPayment } from './statusPayment.entity';

@Entity('fin_detalle_pago')
export class DetailPayment {
  @PrimaryGeneratedColumn('uuid', { name: '_id' })
  id: string;

  @Column({ name: 'pago_id', nullable: false })
  facturaId: number;

  @Column('decimal', { name: 'valor_pago', nullable: false })
  valorPago: number;

  @Column('decimal', { name: 'total_pago', nullable: false })
  totalPago: number;

  @Column('integer', { name: 'int_n_pago', nullable: true })
  intNPago: number | null;

  @Column('datetime', { name: 'fecha', nullable: false })
  fecha: Date;

  @Column('integer', { name: 'estado_pago_id', nullable: false })
  estadoPagoId: number;

  @Column('integer', { name: 'forma_pago_id', nullable: false })
  formaPagoId: number;

  @Column('varchar', { name: 'nombre_banco', nullable: true })
  nombreBanco: string | null;

  @Column('varchar', { name: 'codigo_transaccion', nullable: false })
  codigoTransaccion: string;

  @Column('varchar', { name: 'ticketID', nullable: true })
  ticketID: string | null;

  @Column('varchar', { name: 'banco_recaudo_id', nullable: true })
  bancoRecaudoId: number | null;

  @ManyToOne(() => Invoice, (invoice) => invoice.detailPayments)
  @JoinColumn([{ name: 'pago_id', referencedColumnName: 'id' }])
  invoice: Invoice;

  @ManyToOne(
    () => StatusPayment,
    (statusPayment) => statusPayment.detailPayments,
  )
  @JoinColumn([{ name: 'estado_pago_id', referencedColumnName: 'id' }])
  statusPayment: StatusPayment;
  
  @ManyToOne(
    () => FormOfPayment,
    (formOfPayment) => formOfPayment.detailPayments,
  )
  @JoinColumn([{ name: 'forma_pago_id', referencedColumnName: 'id' }])
  formOfPayment: FormOfPayment;
}
