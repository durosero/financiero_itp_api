import { EStatusLog } from 'src/interfaces/responseInvoice.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('fin_request_log')
export class RequestLog {
  @PrimaryGeneratedColumn('increment', { name: '_id' })
  id: number;

  @Column('tinytext', { name: 'url_service', nullable: false })
  urlService: string | null;

  @Column('tinytext', { name: 'body_request', nullable: true })
  bodyRequest: string | null;

  @Column('longtext', { name: 'body_response', nullable: false })
  bodyResponse: string | null;

  @Column('longtext', { name: 'header_request', nullable: false })
  headerRequest: string | null;

  @Column('integer', { name: 'status_code', nullable: true })
  statusCode: number | null;

  @Column('tinytext', { name: 'message', nullable: true })
  message: string | null;

  @Column('varchar', { name: 'client_ip', nullable: true })
  clientIp: string | null;

  @Column('varchar', { name: 'invoice_id', nullable: true })
  invoiceId: number | null;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date;
}
