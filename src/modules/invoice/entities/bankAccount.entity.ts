import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DetailPayment } from './detailPayment.entity';

@Entity('fin_banco_recaudo')
export class BankAccount {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column({ name: 'descripcion', nullable: false, type: 'varchar' })
  descripcion: string;

  @Column({ name: 'codigo', nullable: false, type: 'varchar' })
  codigo: string;

  @Column({ name: 'cuenta_banco', nullable: false, type: 'varchar' })
  cuentaBanco: string;

  @OneToMany(() => DetailPayment, (detailPayment) => detailPayment.bankAccount)
  detailPayments: DetailPayment[];
}
