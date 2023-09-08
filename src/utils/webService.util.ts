import { IPaymentRegister } from 'src/interfaces/payment.interface';
import { ValidateInvoiceDto } from 'src/modules/invoice/dto/validate-invoice.dto';
import axios from 'axios';
import * as moment from 'moment';
import { IReponsePayment } from 'src/interfaces/responseInvoice.interface';

export const getStatusInvoicePaymentWs = async (referencia_pago: string): Promise<IPaymentRegister | null> => {
  try {
    // const resp  = await  axios.get<IReponsePayment>('https://api-colombia.com/api/v1/Department');
    const { data, status } = await axios.get(
      'https://api-colombia.com/api/v1/Department',
      {
        headers: {
          Accept: 'application/json',
        },
        params: {
          referencia_pago,
        },
      },
    );

    const paymentResponse: IReponsePayment = {
      referencia_pago: referencia_pago,
      estado_pago: 1,
      valor_pagado: 13470,
      codigo_transaccion: '1970816193',
      fecha: '15/03/2023 09:47:25',
    };

    const parseResponse: IPaymentRegister = {
      invoiceId: Number(paymentResponse.referencia_pago),
      value: paymentResponse.valor_pagado,
      transactionCode: paymentResponse.codigo_transaccion,
      status: paymentResponse.estado_pago,
      date: moment(paymentResponse.fecha, 'DD/MM/YYYY HH:mm:ss').toDate(),
      bankId: 3, // TODO: implemten bank id
    };

    return parseResponse;
  } catch (error) {
    console.log(error);
    return null;
  }
};
