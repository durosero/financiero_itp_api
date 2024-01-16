import { ColumnDateTransformer } from 'src/classes/columnDateTransformer';
import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm';


@Index('PRIMARY', ['id'], { unique: true })
@Entity('col_colegio_periodo')
export class UniversityPeriod {
  @PrimaryGeneratedColumn('increment', { name: 'cod_colegio_periodo' })
  id: number;

  @Column({ name: 'cod_colegio', nullable: false })
  codColegio: number;

  @Column({ name: 'cod_periodo', nullable: false, type: 'integer' })
  codPeriodo: number;

  @Column({
    name: 'fec_inicio',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecInicio: Date | null;

  @Column({
    name: 'fec_fin',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecFin: Date | null;

  @Column({ name: 'cod_estado', nullable: false, type: 'integer' })
  codEstado: number;

  @Column({
    name: 'fec_ini_ins_nuevos',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecIniInsNuevos: Date | null;

  @Column({
    name: 'fec_fin_ins_nuevos',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecFinInsNuevos: Date | null;

  @Column({
    name: 'fec_ini_ins_antiguos',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecIniInsAntiguos: Date | null;

  @Column({
    name: 'fec_fin_ins_antiguos',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecFinInsAntiguos: Date | null;

  @Column({
    name: 'fec_ini_mat_nuevos',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecIniMatNuevos: Date | null;

  @Column({
    name: 'fec_fin_mat_nuevos',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecFinMatNuevos: Date | null;

  @Column({
    name: 'fec_ini_mat_antiguos',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecIniMatAntiguos: Date | null;

  @Column({
    name: 'fec_fin_mat_antiguos',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecFinMatAntiguos: Date | null;

  // @Column({
  //   name: 'fec_ini_matordinaria',
  //   nullable: true,
  //   type: 'date',
  //   transformer: new ColumnDateTransformer(),
  // })
  // fecIniMatordinaria: Date | null;

  // @Column({
  //   name: 'fec_fin_matordinaria',
  //   nullable: true,
  //   type: 'date',
  //   transformer: new ColumnDateTransformer(),
  // })
  // fecFinMatOrdinaria: Date | null;

  @Column({
    name: 'fec_ini_matordnew',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecIniMatordinariaNew: Date | null;

  @Column({
    name: 'fec_fin_matordnew',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecFinMatOrdinariaNew: Date | null;

  @Column({
    name: 'fec_ini_matordant',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecIniMatordinariaAnt: Date | null;

  @Column({
    name: 'fec_fin_matordant',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecFinMatOrdinariaAnt: Date | null;

  @Column({
    name: 'fec_ini_matextraord',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecIniMatextraord: Date | null;

  @Column({
    name: 'fec_fin_matextraord',
    nullable: true,
    type: 'date',
    transformer: new ColumnDateTransformer(),
  })
  fecFinMatextraord: Date | null;
}
