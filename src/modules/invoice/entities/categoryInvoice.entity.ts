import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DetailInvoice } from './detailInvoice.entity';
import { Invoice } from './invoice.entity';
import { Package } from './package.entity';

@Entity('fin_categoria_pago')
export class CategoryInvoice {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column('varchar', { name: 'descripcion', nullable: false })
  descripcion: string;

  @OneToMany(() => Invoice, (invoice) => invoice.categoryInvoice)
  invoices: Invoice[];

  @OneToMany(() => Package, (packagee) => packagee.category)
  packages: Package[];
}
