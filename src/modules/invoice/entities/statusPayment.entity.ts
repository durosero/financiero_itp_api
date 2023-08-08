import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DetailPayment } from './detailPayment.entity';

@Entity('fin_estado_pago')
export class StatusPayment {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column({ name: 'descripcion', nullable: false })
  descripcion: string;

  @OneToMany(
    () => DetailPayment,
    (detailPayment) => detailPayment.statusPayment,
  )
  detailPayments: DetailPayment[];
}
