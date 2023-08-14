import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ESysApoloStatus } from '../enums/invoice.enum';
import { DetailInvoice } from './detailInvoice.entity';
import { DetailPayment } from './detailPayment.entity';
import { Person } from './person.entity';

@Entity('fin_pago')
export class Invoice {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column({ name: 'codigo' })
  codigo: string;

  @Column({ unique: true, name: 'codigo_barras', nullable: true })
  codigoBarras: string | null;

  @Column({ name: 'descripcion', nullable: true })
  descripcion: string | null;

  @Column({ name: 'json_response', nullable: true })
  jsonResponse: string | null;

  @Column({ name: 'estado_id', nullable: false })
  estadoId: number;

  @Column('timestamp', { name: 'fecha', nullable: false })
  fecha: Date;

  @Column('varchar', { name: 'estudiante_id', nullable: true })
  estudianteId: string | null;

  @Column({ name: 'matricula_id', nullable: true })
  matriculaId: number | null;

  @Column('decimal', { name: 'valor', default: 0, nullable: true })
  valor: number | null;

  @Column('varchar', { name: 'valor_letras' })
  valorLetras: string | null;

  @Column({ name: 'periodo_id', nullable: true })
  periodoId: number | null;

  @Column({ name: 'cod_paquete', nullable: true })
  codPaquete: number | null;

  @Column({ name: 'is_online', nullable: true })
  isOnline: number | null;

  @Column({ name: 'categoria_pago_id', nullable: true })
  categoriaPagoId: number | null;

  @Column({ name: 'json_detalle', nullable: true })
  jsonDetalle: string | null;

  @Column({ name: 'fecha_update', nullable: true })
  fechaUpdate: Date | null;

  @Column({ name: 'fecha_limite', nullable: true })
  fechaLimite: Date | null;

  @Column({ name: 'fecha_reverso', nullable: true })
  fechaReverso: Date | null;

  @Column('decimal', { name: 'valor_reverso', nullable: true })
  valorReverso: number | null;

  @Column('integer', { name: 'sysapolo_verify', nullable: true })
  sysapoloVerify: ESysApoloStatus;

  @Column('integer', { name: 'email_send', nullable: true })
  emailSend: number | null;

  @OneToMany(() => DetailInvoice, (detailInvoice) => detailInvoice.invoice)
  detailInvoices: DetailInvoice[];

  @OneToMany(() => DetailPayment, (detailPayments) => detailPayments.invoice)
  detailPayments: DetailPayment[];

  @ManyToOne(() => Person, (person) => person.invoices)
  @JoinColumn([{ name: 'estudiante_id', referencedColumnName: 'id' }])
  person: Person;
}
