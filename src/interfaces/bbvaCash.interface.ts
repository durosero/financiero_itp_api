import { ESeverityCode } from "src/modules/invoice/enums/invoice.enum";
import { EResponseDescription } from "./responseInvoice.interface";

export interface IResponseConsult {
  Fecha_limite_pago: string;
  Valor_factura: number;
  Codigo_Estado: ESeverityCode;
  Descripción_estado: EResponseDescription;
  Info_Adicional?: string | null;
}
