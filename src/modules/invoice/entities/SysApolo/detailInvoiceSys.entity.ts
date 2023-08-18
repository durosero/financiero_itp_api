import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('vup_fact_concepto_escolar_detalle_pk', ['id'], { unique: true })
@Entity('vup_fact_concepto_escolar_detalle')
export class DetailInvoiceSys {
  @PrimaryColumn({
    name: 'ide_fact_concepto_det',
    type: 'int',
  })
  id: number;

  @Index('fk_con_esc_detalle_enc', ['facturaId'])
  @Column({ name: 'ide_fact_concepto_enc', type: 'int', nullable: false })
  facturaId: number;

  @Column({ name: 'ide_concepto', type: 'int', nullable: false })
  conceptoId: number;

  @Column({ name: 'cantidad', type: 'numeric', nullable: false })
  cantidad: number;

  @Column({ name: 'valor_concepto', type: 'numeric', nullable: false })
  valorConcepto: number;

  @Column({ name: 'sub_total', type: 'numeric', nullable: false })
  subTotal: number;

  @Column({
    name: 'ide_contabilidad_debito_causacion',
    type: 'int',
    nullable: false,
  })
  idContabilidadDebitoCausacion: number;

  @Column({
    name: 'ide_contabilidad_credito_causacion',
    type: 'int',
    nullable: false,
  })
  idContabilidadCreditoCausacion: number;

  @Column({
    name: 'ide_encabezado_contabilidad_causacion',
    type: 'bigint',
    nullable: false,
  })
  idEncabezadoContabilidadCausacion: number;

  @Column({
    name: 'ide_contabilidad_debito_recaudo',
    type: 'int',
    nullable: false,
  })
  idContabilidadDebitoRecaudo: number;

  @Column({
    name: 'ide_contabilidad_credito_recaudo',
    type: 'int',
    nullable: false,
  })
  idContabilidadCreditoRecaudo: number;

  @Column({
    name: 'ide_encabezado_contabilidad_recaudo',
    type: 'bigint',
    nullable: false,
  })
  idEncabezadoContabilidadRecaudo: number;

  @Column({ name: 'ide_presupuesto_recurso', type: 'int', nullable: false })
  idePresupuestoRecurso: number;

  @Column({
    name: 'cod_centro_costo_deb_causacion',
    type: 'varchar',
    nullable: false,
  })
  codCentroCostoDebCausacion: string;

  @Column({
    name: 'cod_centro_costo_cre_causacion',
    type: 'varchar',
    nullable: false,
  })
  codCentroCostoCreCausacion: string;

  @Column({
    name: 'cod_centro_costo_deb_recaudo',
    type: 'varchar',
    nullable: false,
  })
  codCentroCostoDebRecaudo: string;

  @Column({
    name: 'cod_centro_costo_cre_recaudo',
    type: 'varchar',
    nullable: false,
  })
  codCentroCostoCreRecaudo: string;
}
