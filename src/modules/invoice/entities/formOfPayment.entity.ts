import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DetailPayment } from './detailPayment.entity';

@Entity('fin_forma_pago')
export class FormOfPayment {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column({ name: 'descripcion', nullable: false, type: 'varchar' })
  descripcion: string;

  @OneToMany(
    () => DetailPayment,
    (detailPayment) => detailPayment.formOfPayment,
  )
  detailPayments: DetailPayment[];
}
