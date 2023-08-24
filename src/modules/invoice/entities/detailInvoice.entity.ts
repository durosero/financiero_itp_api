import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ColumnNumericTransformer } from '../../../classes/columnNumericTransformer';
import { Concept } from './concept.entity';
import { Invoice } from './invoice.entity';

@Entity('fin_detalle_factura')
export class DetailInvoice {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column({ name: 'pago_id', nullable: false })
  facturaId: number;

  @Column({ name: 'concepto_id', nullable: false })
  conceptoId: number;

  @Column('decimal', {
    name: 'descuento',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  descuento: number;

  @Column('decimal', {
    name: 'aumento',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  aumento: number;

  @Column('decimal', {
    name: 'valor_unidad',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  valorUnidad: number;

  @Column('integer', { name: 'cantidad', nullable: false })
  cantidad: number;

  subtotal?: number | null;

  @ManyToOne(() => Invoice, (invoice) => invoice.detailInvoices)
  @JoinColumn([{ name: 'pago_id', referencedColumnName: 'id' }])
  invoice: Invoice;

  @ManyToOne(() => Concept, (concept) => concept.detailInvoices)
  @JoinColumn([{ name: 'concepto_id', referencedColumnName: 'id' }])
  concept: Concept;
}
