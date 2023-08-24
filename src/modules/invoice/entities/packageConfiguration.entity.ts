import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Discounts } from './discounts.entity';
import { Package } from './package.entity';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('fin_config')
export class PackageConfiguration {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column({ name: 'descripcion', nullable: false, type: 'varchar' })
  descripcion: string;

  @Column({
    name: 'max_creditos',
    nullable: false,
    type: 'integer',
    default: 20,
  })
  maxCreditos: number;

  @Column({
    name: 'min_creditos',
    nullable: false,
    type: 'integer',
    default: 7,
  })
  minCreditos: number;

  @Column({ name: 'estado', nullable: false, type: 'integer', default: 0 })
  estado: number;

  @Column({ name: 'fecha_creacion', nullable: false, type: 'datetime' })
  fechaCreacion: Date;

  @Column({
    name: 'porcentaje_ext',
    nullable: false,
    type: 'integer',
    default: 0,
  })
  porcentajeExt: number;

  @OneToMany(() => Package, (packagee) => packagee.config)
  packages: Package[];

  @OneToMany(() => Discounts, (discounts) => discounts.config)
  discounts: Discounts[];
}
