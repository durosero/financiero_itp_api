import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IResponseConsult } from 'src/interfaces/bbvaCash.interface';
import { EResponseDescription } from 'src/interfaces/responseInvoice.interface';
import { ESeverityCode } from '../enums/invoice.enum';
import * as moment from 'moment';

@Injectable()
export class BbvaAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(BbvaAuthMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const { headers, body, method, url } = req;
    this.logger.debug({ headers, body, method, url });
    const idComercio = Number(process.env.BBVA_ID_COMERCIO) || 0;
    const password = process.env.BBVA_PASS || '';

    try {
      const body: { Id_Comercio: number; Password: string } = req.body;

      if (
        Number(body.Id_Comercio) === idComercio &&
        body.Password == password
      ) {
        return next();
      }

      const response: IResponseConsult = {
        Valor_factura: 0,
        Codigo_Estado: ESeverityCode.ERROR,
        Descripción_estado: EResponseDescription.ERROR,
        Fecha_limite_pago: moment().format('DD/MM/YYYY'),
      };
      return res.send(response);
    } catch (error) {
      console.log(error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
