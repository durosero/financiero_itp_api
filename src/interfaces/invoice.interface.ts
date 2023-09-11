import { IInfoInvoice, IStudent } from './enrollment.interface';

export interface IGenerateInvoice {
  codPaquete: string;
  matriculaId?: number;
  categoriaPagoId: number;
  total: number;
  isPagoOnline: boolean;
  infoEstudiante: IStudent;
}
