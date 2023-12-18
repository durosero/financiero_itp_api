import { EStatusLog } from 'src/interfaces/responseInvoice.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('fin_request_log')
export class RequestLog {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column('tinytext', { name: 'url_service', nullable: false })
  urlService: string;

  @Column('tinytext', { name: 'json_body', nullable: true })
  jsonJody: string | null;

  @Column('longtext', { name: 'json_response', nullable: false })
  jsonResponse: string | null;

  @Column({
    name: 'estado',
    nullable: true,
    length: 1,
    type: 'char',
    enum: EStatusLog,
    default: EStatusLog.OK,
  })
  estado: EStatusLog | null;

  @Column('tinytext', { name: 'message', nullable: true })
  message: string | null;

  @Column('varchar', { name: 'host', nullable: true })
  host: string | null;

  @Column('timestamp', { name: 'fecha', nullable: true })
  fecha: Date;
}
