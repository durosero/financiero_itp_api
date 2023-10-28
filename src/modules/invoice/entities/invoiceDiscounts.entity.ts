import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Discounts } from './discounts.entity';
import { Invoice } from './invoice.entity';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('fin_factura_descuento')
export class InvoiceDiscounts {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Index('fk_pago_1', ['facturaId'], { unique: true })
  @Column({ name: 'pago_id', nullable: false, type: 'integer' })
  facturaId: number;

  @Index('fk_soporte1', ['porcentajeSoporteId'], { unique: true })
  @Column({ name: 'porcentaje_soporte_id', nullable: false, type: 'integer' })
  porcentajeSoporteId: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDiscounts)
  @JoinColumn([{ name: 'pago_id', referencedColumnName: 'id' }])
  invoice: Invoice;

  @ManyToOne(() => Invoice, (discount) => discount.invoiceDiscounts)
  @JoinColumn([{ name: 'porcentaje_soporte_id', referencedColumnName: 'id' }])
  discount: Discounts;
}
