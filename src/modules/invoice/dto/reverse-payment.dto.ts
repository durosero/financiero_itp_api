import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 2,
    required: true,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  id_banco: number;

  @ApiProperty({
    example: '37987',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(60)
  referencia_pago: number;

  @ApiProperty({
    example: '01/02/2024 18:34:00',
    required: true,
  })
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

  @ApiProperty({
    example: 408800,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  valor_pagado: number;

  @ApiProperty({
    example: 1591681879,
    required: true,
    type: 'string',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  @IsNotEmpty()
  codigo_transaccion: string;
}
