import { DetailInvoice } from '../../modules/invoice/entities/detailInvoice.entity';
import { PackageDetail } from '../../modules/invoice/entities/packageDetail.entity';
import { DeepPartial } from 'typeorm';
import { calcularSubTotal } from '../invoice.util';

export const createDetailInvoice = (
  packageDetail: PackageDetail[],
  aumentoExtra: number,
  descuentoExtra: number,
  quantity: number = 1,
) => {
  return packageDetail
    .map<DeepPartial<DetailInvoice>>((detail) => {
      const { aumento, conceptoId, descuento, valorUnidad, cantidad } = detail;

      return {
        conceptoId,
        valorUnidad,
        aumento: detail.descuentoExt == '1' ? aumentoExtra + aumento : aumento,
        cantidad: cantidad < 1 ? quantity : cantidad,
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
