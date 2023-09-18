import { getBaseUrl } from 'src/config/environments';
import { Person } from '../modules/invoice/entities/person.entity';

export const messageEmailPaymentOk = (
  person: Person,
  category: string,
  invoiceId: number,
) => {
  return `
    Apreciado cliente: ${person.nombre1} ${person.apellido1}
    
    Reciba un cordial saludo.
        
    En el archivo adjunto encontrará los detalles de: ${category}. Para abrir el archivo PDF, por favor utilice como clave los dígitos del número de identificación del cliente. En caso de tener problemas con la descarga o visualizacion del archivo puede usar el siguiente enlace:
    ${getBaseUrl()}/invoice/payment/pdf/${invoiceId} 
        `;
};
