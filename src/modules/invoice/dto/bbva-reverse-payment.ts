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

export class BbvaReversePaymentDto {
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

  @IsString()
  @MaxLength(200)
  @IsOptional()
  Info_adicional?: string | null;

  @IsNotEmpty()
  @Transform(({ value }) => {
    const auxDate = new Date();
    const dateReverse = moment(value, 'DD/MM/YYYY').toDate();
    dateReverse.setHours(auxDate.getHours());
    dateReverse.setMinutes(auxDate.getMinutes());
    dateReverse.setSeconds(auxDate.getSeconds());
    return dateReverse;
  })
  Fecha_reverso: Date;

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
}
