import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('vup_punto_pago_pk', ['id'], { unique: true })
@Entity('vup_punto_pago')
export class PaymentPointSys {
  @PrimaryGeneratedColumn('increment', { name: 'cod_punto_pago' })
  id: number;

  @Column({ name: 'nom_punto_pago', nullable: false, type: 'varchar' })
  nomPuntoPago: string;

  @Column({ name: 'anno_punto_pago', nullable: false })
  anioPuntoPago: number;

  @Column({ name: 'num_cuenta_banco', nullable: false, type: 'varchar' })
  numCuentaBanco: string;
}
