import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as moment from 'moment';

export class BbvaRegisterPaymentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  Id_Banco: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  Id_Comercio: number;

  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  Password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(60)
  Referencia_pago: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    const auxDate = new Date();
    const dateReverse = moment(value, 'DD/MM/YYYY').toDate() || new Date();
    dateReverse.setHours(auxDate.getHours());
    dateReverse.setMinutes(auxDate.getMinutes());
    dateReverse.setSeconds(auxDate.getSeconds());
    return dateReverse;
  })
  Fecha_pago: Date;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  Valor_pagado: number;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  @IsNotEmpty()
  Id_transaccion: string;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  @IsOptional()
  Id_transacción?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  Info_adicional?: string | null;

  Nombre_banco?: string;
}
