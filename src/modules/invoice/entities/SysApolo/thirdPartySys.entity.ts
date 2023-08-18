import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index('PK_TERCERO', ['id'], { unique: true })
@Entity('TERCERO')
export class ThirdPartySys {
  @PrimaryColumn({ name: 'cod_ter', type: 'varchar' })
  id: string;

  @Column({ name: 'ide_tipo_identificacion', type: 'int', nullable: false })
  idTipoIdentificacion: number;

  @Column({ name: 'nit_ter', type: 'varchar', nullable: false })
  nitTercero: string;

  @Column({ name: 'num_identificacion', type: 'varchar', nullable: false })
  numIdentificacion: string;

  @Column({ name: 'dig_verificacion', type: 'char', nullable: false })
  digVerificacion: string;

  @Column({ name: 'nom_ter', type: 'varchar', nullable: false })
  nomTercero: string;

  @Column({ name: 'pri_apellido', type: 'varchar', nullable: false })
  priApellido: string;

  @Column({ name: 'seg_apellido', type: 'varchar', nullable: false })
  segApellido: string;

  @Column({ name: 'pri_nombre', type: 'varchar', nullable: false })
  priNombre: string;

  @Column({ name: 'otr_nombre', type: 'varchar', nullable: false })
  otrNombre: string;

  @Column({ name: 'cla_ter', type: 'varchar', nullable: false })
  claTercero: string;

  @Column({ name: 'dir_ter', type: 'varchar', nullable: false })
  dirTercero: string;

  @Column({ name: 'tel_ter', type: 'varchar', nullable: false })
  telTercero: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

  @Column({ name: 'ide_mun', type: 'varchar', nullable: false })
  ideMun: string;

  @Column({ name: 'sex_tercero', type: 'char', nullable: false })
  sexTercero: string;

  @Column({ name: 'est_tercero', type: 'char', nullable: false })
  estTercero: string;

  @Column({ name: 'salario_mensual', type: 'numeric', nullable: false })
  salarioMensual: number;

  @Column({ name: 'fec_ingreso', type: 'datetime', nullable: false })
  fecIngreso: Date;

  @Column({ name: 'fec_nacimiento', type: 'datetime', nullable: false })
  fecNacimiento: Date;

  @Column({ name: 'tip_tercero', type: 'char', nullable: false })
  tipTercero: string;
}
