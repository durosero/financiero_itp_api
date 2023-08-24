import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Discounts } from './discounts.entity';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('fin_porcetaje_categoria')
export class DiscountCategory {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column({ name: 'descripcion', nullable: false, type: 'varchar' })
  descripcion: string;

  @OneToMany(() => Discounts, (discount) => discount.discountCategory)
  discounts: Discounts[];
}
