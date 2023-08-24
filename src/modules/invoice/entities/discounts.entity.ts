import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EDiscountStatus } from '../enums/invoice.enum';
import { DiscountCategory } from './discountCategory.entity';
import { PackageConfiguration } from './packageConfiguration.entity';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('fin_porcentaje_soporte')
export class Discounts {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Index('fk_config_file', ['configId'])
  @Column({ name: 'config_id', nullable: false, type: 'integer' })
  configId: number | null;

  @Column('datetime', { name: 'fecha', nullable: false })
  fecha: Date;

  @Column('integer', {
    name: 'porcentaje_estado_id',
    nullable: false,
    default: EDiscountStatus.PENDIENTE,
  })
  porcentajeEstadoId: EDiscountStatus;

  @Index('fk_porcentaje_perso', ['estudianteId'])
  @Column('varchar', { name: 'estudiante_id', nullable: true })
  estudianteId: string;

  @Column('integer', { name: 'matricula_id', nullable: true })
  matriculaId: number;

  @Column('integer', { name: 'porcentaje_categoria_id', nullable: true })
  porcentajeCategoriaId: number;

  @Column('double', { name: 'porcentaje', nullable: true })
  porcentaje: number;

  @Index('fk_descuento_periodo', ['periodoId'])
  @Column('integer', { name: 'periodo_id', nullable: true })
  periodoId: number;

  @Column('varchar', { name: 'nom_periodo', nullable: true })
  nomPeriodo: string | null;

  @Column('text', { name: 'observacion', nullable: true })
  observacion: string | null;

  @Column('char', { name: 'accion', nullable: true, default: '1' })
  accion: string;

  @Column('char', { name: 'tipo', nullable: true, default: '0' })
  tipo: string;

  @Column('text', { name: 'json_file', nullable: true })
  jsonFile: string | null;

  @Column('varchar', { name: 'codigo_cargue', nullable: true })
  codigoCargue: string | null;

  @Column({
    name: 'categoria_pago_id',
    nullable: true,
    type: 'integer',
    default: 1,
  })
  categoriaPagoId: number | null;

  @Column('varchar', { name: 'id_personaregistra', nullable: true })
  idPersonaRegistra: string | null;

  @ManyToOne(
    () => DiscountCategory,
    (discountCategory) => discountCategory.discounts,
  )
  @JoinColumn([{ name: 'porcentaje_categoria_id', referencedColumnName: 'id' }])
  discountCategory: DiscountCategory;

  @JoinColumn([{ name: 'config_id', referencedColumnName: 'id' }])
  config: PackageConfiguration;
}
