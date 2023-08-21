import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Concept } from './concept.entity';
import { Package } from './package.entity';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('fin_detalle_paquete')
export class PackageDetail {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column('decimal', { name: 'descuento', nullable: false })
  descuento: number;

  @Index('fk_paquete_3', ['paqueteId'])
  @Column({ name: 'paquete_id', nullable: false, type: 'integer' })
  paqueteId: number;

  @Index('fk_concepto_pago', ['conceptoId'])
  @Column({ name: 'concepto_id', nullable: false, type: 'integer' })
  conceptoId: number;

  @Column('decimal', { name: 'aumento', nullable: false })
  aumento: number;

  @Column('integer', { name: 'cantidad', nullable: false })
  cantidad: number;

  @Column('decimal', { name: 'valor_unidad', nullable: false })
  valorUnidad: number;

  @Column({
    name: 'descuento_ext',
    nullable: false,
    type: 'char',
    default: 0,
    comment: 'descuento externo o extra',
  })
  descuentoExt: string;

  @ManyToOne(() => Concept, (concept) => concept.packageDetail)
  @JoinColumn([{ name: 'concepto_id', referencedColumnName: 'id' }])
  concept: Concept;

  @ManyToOne(() => Package, (packagee) => packagee.packageDetail)
  @JoinColumn([{ name: 'paquete_id', referencedColumnName: 'id' }])
  packagee: Package;
}
