import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('fin_factura_descuento')
export class InvoiceDiscount {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Index('fk_pago_1', ['facturaId'], { unique: true })
  @Column({ name: 'pago_id', nullable: false, type: 'integer' })
  facturaId: number;

  @Index('fk_soporte1', ['porcentajeSoporteId'], { unique: true })
  @Column({ name: 'porcentaje_soporte_id', nullable: false, type: 'integer' })
  porcentajeSoporteId: number;
}
