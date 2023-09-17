import StreamTransport from 'nodemailer/lib/stream-transport';
import { Discounts } from 'src/modules/invoice/entities/discounts.entity';
import { UniversityPeriod } from 'src/modules/invoice/entities/univsityPeriod.entity';
import { IInfoInvoice, IStudent } from './enrollment.interface';

export interface IGenerateInvoice {
  codPaquete: string;
  matriculaId?: number;
  categoriaPagoId: number;
  total: number;
  isPagoOnline: boolean;
  infoEstudiante: IStudent;
}

export interface IInvicePdfParams {
  barcodeOrd: string;
  barcodeExt?: string;
  infoStudent: IStudent;
  discounts?: Discounts[];
  period?: UniversityPeriod;
  totalOrdinario: number;
  totalExtraordinario?: number;
  qrBase64?: string;
  generated?: Date;
  limitDate?: Date;
}
