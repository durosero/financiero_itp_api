import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { DocumentType } from './documentType.entity';
import { Invoice } from './invoice.entity';
@Entity('col_persona')
export class Person {
  @PrimaryColumn('varchar', { name: 'ide_persona', nullable: false })
  id: string;

  @PrimaryColumn('int', { name: 'tipo_doc', nullable: false })
  tipoDoc: number;

  @Column('varchar', { name: 'ape1_persona', nullable: false })
  apellido1: string;

  @Column('varchar', { name: 'ape2_persona', nullable: true })
  apellido2: string | null;

  @Column('varchar', { name: 'nom1_persona', nullable: false })
  nombre1: string;

  @Column('varchar', { name: 'nom2_persona', nullable: true })
  nombre2: string | null;

  @Column('varchar', { name: 'email_persona', nullable: true })
  email: string | null;

  @Column('varchar', { name: 'cel_persona', nullable: true })
  phone: string | null;

  @Column('varchar', { name: 'dir_persona', nullable: true })
  direccion: string | null;

  @Column('varchar', { name: 'ide_genero', nullable: true })
  genero: string | null;

  @Column('varchar', { name: 'cod_mpio_residencia', nullable: true })
  codMunicipio: string | null;

  @OneToMany(() => Invoice, (invoice) => invoice.person)
  invoices: Invoice[];

  @ManyToOne(() => DocumentType, (documentType) => documentType.persons)
  @JoinColumn([{ name: 'tipo_doc', referencedColumnName: 'id' }])
  documentType: DocumentType;
}
