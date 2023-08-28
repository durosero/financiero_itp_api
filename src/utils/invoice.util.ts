import * as QRCode from 'qrcode';
import { generate } from 'randomstring';
import { DeepPartial } from 'typeorm';
import { IStudent } from '../interfaces/enrollment.interface';
import { IDescriptionSys, ITotales } from '../interfaces/payment.interface';
import { DetailInvoice } from '../modules/invoice/entities/detailInvoice.entity';

export const limpiarCampos = (cadena: string = '') => {
  cadena.toString().replace(/[`~!@#$%^&*¬()_|\-=?;:'",.<>\{\}\[\]\\\/]/gim, '');
};

export const generateDescriptionSys = (payload: IDescriptionSys): string => {
  const { category, datePayment, formPayment, program, transactionCode } =
    payload;

  return `${category} - ${program} - ${formPayment} - ${transactionCode} - ${datePayment}`;
};

//esto solo puede funcionar si el aumento solo corresponde a la matricula extraordinaria
export const calcularTotales = (detalle: DetailInvoice[]): ITotales => {
  const totalExtraordinario = detalle
    .map(({ valorUnidad, cantidad, aumento, descuento }) => {
      const subtotal = valorUnidad * cantidad;
      //primero se aplica el aumento, para calcular el descuento sobre el resultado obtenido
      const subtotalDescuento = subtotal * descuento;
      const subtotalAumento = subtotal * aumento;
      return subtotal - subtotalDescuento + subtotalAumento;
    })
    .reduce((a, b) => a + b, 0);

  const totalOrdinario = detalle
    .map(({ valorUnidad, cantidad, aumento, descuento }) => {
      const subtotal = valorUnidad * cantidad;
      return subtotal - subtotal * descuento;
    })
    .reduce((a, b) => a + b, 0);

  return {
    totalExtraordinario,
    totalOrdinario,
  };
};

export const calcularSubTotal = (
  detInvoice: DeepPartial<DetailInvoice>,
): number => {
  const { valorUnidad, cantidad, aumento, descuento } = detInvoice;
  const subtotal = valorUnidad * cantidad;
  //primero se aplica el descueto
  const subtotalDescuento = subtotal * descuento;
  const subtotalAumento = subtotal * aumento;
  return subtotal - subtotalDescuento + subtotalAumento;
};

export const llenarSubTotal = (
  detInvoice: DetailInvoice[],
): DetailInvoice[] => {
  return detInvoice.map((detail) => {
    return {
      ...detail,
      subtotal: calcularSubTotal(detail),
    };
  });
};

export const generateCodeInvoice = (info: IStudent): string => {
  const cadena =
    info.ape1_persona +
    info.ape2_persona +
    info.nom1_persona +
    info.nom2_persona +
    info.ide_persona;

  const newString = cadena
    .replace(/\s+/g, '')
    .replace(/[`~!@#$%^&*¬()_|\-=?;:'",.<>\{\}\[\]\\\/]/gim, '');

  return generate({
    charset: cadena,
    length: 10,
  });
};

export const generateEndDatePayment = (): Date => {
  const currentDate = new Date();
  const dt = new Date();
  const month = dt.getMonth() + 1;
  const year = dt.getFullYear();
  const day = dt.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  currentDate.setDate(daysInMonth);
  return currentDate;
};

export const createQRBase64 = async (
  dataForQRcode: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(
      dataForQRcode,
      { errorCorrectionLevel: 'L', type: 'image/webp' },
      (err: any, src: string) => {
        if (err) reject(err);
        resolve(src);
      },
    );
  });
};
