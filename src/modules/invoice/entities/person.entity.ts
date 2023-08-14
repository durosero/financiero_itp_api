import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
@Entity("col_persona")
export class Person {
  @PrimaryColumn('varchar', { name: 'ide_persona', nullable: false })
  id: string;

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

  @OneToMany(() => Invoice, (invoice) => invoice.person)
  invoices: Invoice[];
}
