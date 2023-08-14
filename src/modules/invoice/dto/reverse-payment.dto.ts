import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as moment from 'moment';

export class ReversePaymentDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  id_banco: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(60)
  referencia_pago: number;

  @IsNotEmpty()
  @Transform(({ value }) => {
    const auxDate = new Date();
    const dateReverse = moment(value, 'DD/MM/YYYY').toDate();
    dateReverse.setHours(auxDate.getHours());
    dateReverse.setMinutes(auxDate.getMinutes());
    dateReverse.setSeconds(auxDate.getSeconds());
    return dateReverse;
  })
  fecha_reverso: Date;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  valor_pagado: number;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  @IsNotEmpty()
  id_transaccion: string;
}
