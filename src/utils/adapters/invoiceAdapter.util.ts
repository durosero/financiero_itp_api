import { DetailInvoice } from '../../modules/invoice/entities/detailInvoice.entity';
import { PackageDetail } from '../../modules/invoice/entities/packageDetail.entity';
import { DeepPartial } from 'typeorm';
import { calcularSubTotal } from '../invoice.util';
import { ICreateDetailInvoice } from 'src/interfaces/invoice.interface';

export const createDetailInvoice = ({
  packageDetail,
  aumentoExtra = 0,
  descuentoExtra = 0,
  quantity = 1,
  total = 0,
}: ICreateDetailInvoice) => {
  return packageDetail
    .map<DeepPartial<DetailInvoice>>((detail) => {
      const { aumento, conceptoId, descuento, valorUnidad, cantidad } = detail;
      const c = cantidad < 1 || quantity > 1 ? quantity : cantidad;
      return {
        conceptoId,
        valorUnidad: total > 0 ? total : valorUnidad,
        concept: detail.concept,
        aumento: detail.descuentoExt == '1' ? aumentoExtra + aumento : aumento,
        cantidad: c,
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
