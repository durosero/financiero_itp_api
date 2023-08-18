import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from './person.entity';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('col_tipodoc')
export class DocumentType {
  @PrimaryGeneratedColumn('increment', { name: 'tipo_doc', type: 'int' })
  id: number;

  @Column({ name: 'nom_doc', type: 'varchar', nullable: false })
  nomDoc: string;

  @Column({ name: 'siglas', type: 'varchar', nullable: false })
  siglas: string;

  @Column({ name: 'cod_sysapolo', type: 'int', nullable: false })
  codSysapolo: number;

  @OneToMany(() => Person, (person) => person.documentType)
  persons: Person[];
}
