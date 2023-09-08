import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  EEmailStatus,
  EOnlinePayment,
  ESysApoloStatus,
} from '../enums/invoice.enum';
import { CategoryInvoice } from './categoryInvoice.entity';
import { DetailInvoice } from './detailInvoice.entity';
import { DetailPayment } from './detailPayment.entity';
import { Person } from './person.entity';

@Index('PRIMARY', ['id'], { unique: true })
@Entity('fin_pago')
export class Invoice {
  @PrimaryGeneratedColumn({ name: '_id' })
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

  @Index('fk_pago_estudiante_1', ['estudianteId'])
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

  @Column({ name: 'cod_paquete', nullable: true, type: 'varchar' })
  codPaquete: string | null;

  @Column({
    name: 'is_online',
    nullable: true,
    type: 'enum',
    enum: EOnlinePayment,
  })
  isOnline: EOnlinePayment | null;

  @Index('fk_cat_pago_1', ['categoriaPagoId'])
  @Column({ name: 'categoria_pago_id', nullable: true, type: 'integer' })
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

  @Column('enum', {
    name: 'sysapolo_verify',
    nullable: true,
    enum: ESysApoloStatus,
    default: ESysApoloStatus.PENDIENTE,
  })
  sysapoloVerify: ESysApoloStatus;

  @Column('enum', {
    name: 'email_send',
    nullable: true,
    enum: EEmailStatus,
    default: EEmailStatus.PENDIENTE,
  })
  emailSend: EEmailStatus;

  @OneToMany(() => DetailInvoice, (detailInvoice) => detailInvoice.invoice, {
    cascade: true,
  })
  detailInvoices: DetailInvoice[];

  @OneToMany(() => DetailPayment, (detailPayments) => detailPayments.invoice)
  detailPayments: DetailPayment[];

  @ManyToOne(() => Person, (person) => person.invoices)
  @JoinColumn([{ name: 'estudiante_id', referencedColumnName: 'id' }])
  person: Person;

  @ManyToOne(
    () => CategoryInvoice,
    (categoryInvoice) => categoryInvoice.invoices,
  )
  @JoinColumn([{ name: 'categoria_pago_id', referencedColumnName: 'id' }])
  categoryInvoice: CategoryInvoice;
}
