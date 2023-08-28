import { CategoryInvoice } from '../modules/invoice/entities/categoryInvoice.entity';
import { DetailInvoice } from '../modules/invoice/entities/detailInvoice.entity';
import { DetailPayment } from '../modules/invoice/entities/detailPayment.entity';
import { Invoice } from '../modules/invoice/entities/invoice.entity';
import { EStatusInvoice } from '../modules/invoice/enums/invoice.enum';
import { IStudent } from './enrollment.interface';

export interface IPaymentSearch {
  invoiceId: number;
  value: number;
  transactionCode: string;
  bankId?: number;
}

export interface IPaymentRegister {
  invoiceId: number;
  value: number;
  transactionCode: string;
  status: EStatusInvoice;
  date: Date;
  bankId?: number;
}

export interface IDescriptionSys {
  category: string;
  program: string;
  formPayment: string;
  transactionCode: string;
  datePayment: string;
}

export interface ITotales {
  totalExtraordinario: number;
  totalOrdinario: number;
}

export interface IPaymentReceipt {
  client: IStudent;
  invoice?: Partial<Invoice>;
  detailPayment: DetailPayment[];
  detailInvoice: DetailInvoice[];
  category: CategoryInvoice;
  totalInt?: number;
  qrBase64?: string;
  url?: string;
}
