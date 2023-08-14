import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('vup_fact_concepto_escolar_encabezado')
export class InvoiceSys {
  @PrimaryColumn({ name: 'ide_fact_concepto_enc', type: 'int' })
  id: number;

  @Column({ name: 'num_recibo', type: 'numeric', nullable: false })
  numRecibo: number;

  @Column({ name: 'fec_recibo', type: 'datetime', nullable: false })
  fecRecibo: number;

  @Column({ name: 'cod_ter', type: 'varchar', nullable: false })
  codTercero: string;

  @Column({ name: 'ide_usuario', type: 'int', nullable: false })
  ideUsuario: string;

  @Column({ name: 'det_recibo', type: 'varchar', nullable: false })
  detRecibo: string;

  @Column({ name: 'valor_concepto', type: 'numeric', nullable: false })
  valorConcepto: number;

  @Column({ name: 'valor_recaudo', type: 'numeric', nullable: false })
  valorRecaudo: number;

  @Column({ name: 'cod_punto_pago', type: 'smallint', nullable: false })
  codPuntoPago: number;

  @Column({ name: 'pagado', type: 'char', nullable: false })
  pagado: string;

  @Column({ name: 'ide_banco', type: 'int', nullable: false })
  ideBanco: number;

  @Column({ name: 'cod_colegio', type: 'int', nullable: false })
  codColegio: number;

  @Column({ name: 'cod_forma_pago', type: 'int', nullable: false })
  codFormaPago: number;

  @Column({ name: 'cod_nivel_educativo', type: 'int', nullable: false })
  codNivelEducativo: number;
}
