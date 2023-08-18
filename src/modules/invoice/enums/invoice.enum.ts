export enum EStatusInvoice {
  PAGO_INICADO = 200,
  PAGO_FINALIZADO_OK = 1,
  PAGO_RECHAZADO = 1000,
}

export enum ESysApoloStatus {
  REGISTRADO = '1',
  PENDIENTE = '0',
}

export enum EEmailStatus {
  ENVIADO = '1',
  PENDIENTE = '0',
}

export enum ESeverity {
  INFORMATIVE = 'I',
  WARNING = 'W',
  ERROR = 'E',
}

export enum ESeverityCode {
  INFORMATIVE = 0,
  WARNING = 1,
  ERROR = 2,
}

export enum EFormPayment {
  PSE = 29,
  EFECTIVO = 99,
  TC = 32,
}
