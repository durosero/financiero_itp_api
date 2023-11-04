import { ICreateDetailInvoice } from 'src/interfaces/invoice.interface';
import { ECategoryInvoice } from 'src/modules/invoice/enums/invoice.enum';
import { DeepPartial } from 'typeorm';
import { DetailInvoice } from '../../modules/invoice/entities/detailInvoice.entity';
import { calcularSubTotal } from '../invoice.util';

export const createDetailInvoice = ({
  packageDetail,
  aumentoExtra = 0,
  descuentoExtra = 0,
  quantity = 1,
  total = 0,
  categoriaId = 0,
}: ICreateDetailInvoice) => {
  return packageDetail
    .map<DeepPartial<DetailInvoice>>((detail) => {
      const { aumento, conceptoId, descuento, valorUnidad, cantidad } = detail;

      if (categoriaId == ECategoryInvoice.MATRICULA) {
        // solo se usa la cantidad enviada si son conceptos de creditos individuales
        if (![1, 2].includes(Number(conceptoId))) {
          quantity = cantidad;
        }
      }

      return {
        conceptoId,
        valorUnidad: total > 0 ? total : valorUnidad,
        concept: detail.concept,
        aumento: detail.descuentoExt == '1' ? aumentoExtra + aumento : aumento,
        cantidad: Number(quantity < 1 ? 1 : quantity),
        descuento:
          detail.descuentoExt == '1' ? descuentoExtra + descuento : descuento,
      };
    })
    .map((detail) => {
      return {
        ...detail,
        subtotal: calcularSubTotal(detail),
      };
    });
};
