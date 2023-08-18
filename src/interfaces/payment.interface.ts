import { EStatusInvoice } from 'src/modules/invoice/enums/invoice.enum';

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
