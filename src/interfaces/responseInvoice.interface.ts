export interface IResponseInvoice {
  fecha_limite_pago: string;
  valor_factura: number;
  codigo_estado: EResposeStatusCode;
  descripcion_estado: EResponseDescription;
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

export enum EResposeStatusCode {
  OK = 0,
  WARNING = 1,
  ERROR = 2,
}
export enum EResponseDescription {
  OK = 'Exitoso',
  WARNING = 'Factura no disponible para pago',
  ERROR = 'Ocurrio un error inesperado en la operacion',
}

export enum EStatusLog {
  OK = '1',
  ERROR = '0',
}

export interface IRequestLog {
  bodyRequest: object | null;
  headerRequest?: object | null;
  bodyResponse?: object | null;
  headerResponse?: object | null;
  statusCode?: number | null;
  invoiceId?: number | null;
  urlService: string | null;
  clientIp: string | null;
}
