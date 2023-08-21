import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryInvoice } from './categoryInvoice.entity';
import { PackageConfiguration } from './packageConfiguration.entity';
import { PackageDetail } from './packageDetail.entity';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('fin_paquete')
export class Package {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column({ name: 'codigo', nullable: false, type: 'varchar' })
  codigo: string;

  @Column({ name: 'descripcion', nullable: false, type: 'varchar' })
  descripcion: string;

  @Index('fk_categoria', ['categoriaId'])
  @Column('integer', { name: 'categoria_id', nullable: false })
  categoriaId: number;

  @Index('fk_categoria', ['configId'])
  @Column('integer', { name: 'config_id', nullable: false })
  configId: number;

  @ManyToOne(
    () => PackageConfiguration,
    (packageConfiguration) => packageConfiguration.packages,
  )
  @JoinColumn([{ name: 'config_id', referencedColumnName: 'id' }])
  config: PackageConfiguration;

  @ManyToOne(
    () => CategoryInvoice,
    (categoryInvoice) => categoryInvoice.packages,
  )
  @JoinColumn([{ name: 'config_id', referencedColumnName: 'id' }])
  category: CategoryInvoice;

  @OneToMany(() => PackageDetail, (packageDetail) => packageDetail.packagee)
  packageDetail: PackageDetail[];



}
