import { IDescriptionSys, ITotales } from 'src/interfaces/payment.interface';
import { DetailInvoice } from 'src/modules/invoice/entities/detailInvoice.entity';

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
      const subtotalGeneral = subtotal + subtotal * aumento;
      return subtotalGeneral - subtotalGeneral * descuento;
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

export const calcularSubTotal = (detInvoice: DetailInvoice): number => {
  const { valorUnidad, cantidad, aumento, descuento } = detInvoice;
  const subtotal = valorUnidad * cantidad;
  //primero se aplica el aumento, para calcular el descuento sobre el resultado obtenido
  const subtotalGeneral = subtotal + subtotal * aumento;
  return subtotalGeneral - subtotalGeneral * descuento;
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
