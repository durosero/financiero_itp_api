export interface IResponseInvoice {
  fecha_limite_pago: string;
  valor_factura: number;
  codigo_estado: number;
  descripcion_estado: string;
  descripcion_general?: string | null;
}
