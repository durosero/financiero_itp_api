export enum EStatusInvoice {
  PAGO_INICADO = 200,
  PAGO_FINALIZADO_OK = 1,
  PAGO_RECHAZADO = 1000,
}

export enum ESysApoloStatus {
  REGISTRADO = '1',
  PENDIENTE = '0',
}

export enum EOnlinePayment {
  SI = '1',
  NO = '0',
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

export enum ERegisterDescription {
  INFORMATIVE = 'Se realizo exitosamente la actualizacion del pago.',
  WARNING = 'No se pudo realizar la actualizacion del pago.',
  ERROR = 'Ocurrio un error inesperado en la operacion.',
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

export enum ECategoryInvoice {
  OTROS = 0,
  MATRICULA = 1,
  HABILITACIONES_SUPLETORIOS = 4,
  INSCRIPCION = 5,
  REINGRESO = 6,
  CREDITO_ADICIONAL = 7,
  GRADO = 8,
  CERTIFICADOS_CONSTANCIAS = 9,
  HOMOLOGACIONES = 10,
  CARNET_INSTITUCIONAL = 11,
  ESPECIALIZACIONES = 12,
}

export enum EPackageType {
  TECNOLOGICO = 2,
  PROFESIONAL = 3,
  ESPECIALIZACION = 5,
}

export const PACKAGE_TYPE = {
  INDIVIDUAL: {
    6: '1', //TECNOLOGICO
    7: '4', //PROFESIONAL
    11: '5', //ESPECIALIZACION
    16: '33', //ESPECIALIZACION
  },
  COMPLETO: {
    6: '2', //TECNOLOGICO
    7: '3', //PROFESIONAL
    11: '33', //ESPECIALIZACION
    16: '5', //ESPECIALIZACION
  },
};

export enum EPackageCode {
  INSCRIPCION = '6',
  INSCRIPCION_ESPECIALIZACION = '34',
}

export enum EDiscountStatus {
  PENDIENTE = 1,
  APROBADO = 2,
  RECHAZADO = 3,
  FACTURADO = 4,
  INACTIVO = 5,
}

export enum EBankCash {
  BBVA = 'BANCO BBVA COLOMBIA S.A.',
  BANCOLOMBIA = 'BANCOLOMBIA',
  POPULAR = 'BANCO POPULAR',
  DAVIPLATA = 'DAVIPLATA',
  NEQUI = 'NEQUI',
  AGRARIO = 'BANCO AGRARIO',
}
export enum EBankCodeCash {
  BBVA = 13,
  BANCOLOMBIA = 2,
  POPULAR = 3,
}
