import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DetailInvoice } from './detailInvoice.entity';
import { PackageDetail } from './packageDetail.entity';

@Entity('fin_concepto')
export class Concept {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column('varchar', { name: 'codigo', nullable: true })
  codigo: string | null;

  @Column('varchar', { name: 'descripcion', nullable: false })
  descripcion: string;

  @Column('integer', { name: 'cod_sysapolo', nullable: false })
  codSysapolo: number;

  @OneToMany(() => DetailInvoice, (detailInvoice) => detailInvoice.invoice)
  detailInvoices: DetailInvoice[];

  @OneToMany(() => PackageDetail, (packageDetail) => packageDetail.concept)
  packageDetail: PackageDetail[];
}
