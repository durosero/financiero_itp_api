export interface IResponseInvoice {
  fecha_limite_pago: string;
  valor_factura: number;
  codigo_estado: number;
  descripcion_estado: string;
  descripcion_general?: string | null;
}

export interface IReponsePayment {
  referencia_pago: string;
  estado_pago: number;
  valor_pagado: number;
  fecha: string;
  codigo_transaccion: string;
  descripcion?: string | null;
  id_cliente?: string | null;
  nombres_cliente?: string | null;
  apellidos_cliente?: string | null;
}
