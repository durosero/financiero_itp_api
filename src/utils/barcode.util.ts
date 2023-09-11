import * as JsBarcode from 'jsbarcode';
import {
  IBarcodeInput,
  IBarcodeOutput,
} from 'src/interfaces/bbvaCash.interface';
import { DOMImplementation, XMLSerializer } from 'xmldom';
import * as moment from 'moment';

export const generarCodigoBarrasString = ({
  limitDate,
  reference,
  value,
}: IBarcodeInput): IBarcodeOutput => {
  const convenio415: string = process.env.CODIGO_CONVENIO ?? '0077099888573';
  let referencia8020: string = reference;

  let valor390n: string = value.toString();
  const fecha96: string = moment(limitDate).format('YYYYMMDD');

  const length8020: number = 12;
  const length390n: number = 10;

  if (referencia8020.length > length8020) {
    throw new Error('El codigo de referencia supera el máximo permitido');
  }

  if (valor390n.length > length390n) {
    throw new Error('El valor supera el máximo permitido');
  }

  if (referencia8020.length <= length8020) {
    const faltante = length8020 - referencia8020.length;
    for (let i = 0; i < faltante; i++) {
      referencia8020 = '0' + referencia8020;
    }
  }

  if (valor390n.length <= length390n) {
    const faltante = length390n - valor390n.length;
    for (let i = 0; i < faltante; i++) {
      valor390n = '0' + valor390n;
    }
  }

  const codigoBarras = `415${convenio415}8020${referencia8020}3900${valor390n}96${fecha96}`;
  const text = `(415)${convenio415}(8020)${referencia8020}(3900)${valor390n}(96)${fecha96}`;

  return {
    barcode: codigoBarras,
    barcodeText: text,
  };
};

export const dividirCodigoBarrasText = (cadena: string) => {
  const convenio415 = cadena.substring(0, 16);
  const referencia8020 = cadena.substring(16, 16);
  const valor3900 = cadena.substring(16 + 16, 14);
  const fecha96 = cadena.substring(16 + 16 + 14, 10);
  return { convenio415, referencia8020, valor3900, fecha96 };
};

export const generarCodigoBarras = ({
  limitDate,
  reference,
  value,
}: IBarcodeInput): IBarcodeOutput => {
  const { barcode, barcodeText } = generarCodigoBarrasString({
    limitDate,
    reference,
    value,
  });
  const xmlSerializer = new XMLSerializer();
  const document = new DOMImplementation().createDocument(
    'http://www.w3.org/1999/xhtml',
    'html',
    null,
  );
  const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  JsBarcode(svgNode, barcode, {
    xmlDocument: document,
    height: 50,
    width: 1.13,
    fontSize: 10,
    text: barcodeText,
    margin: 2,
  });

  const svgText = xmlSerializer.serializeToString(svgNode);

  return {
    barcode,
    barcodeText,
    barcodeSvg: svgText,
  };
};
