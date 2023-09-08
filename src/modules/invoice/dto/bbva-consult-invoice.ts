import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BbvaConsultInvoiceDto {
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

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  Id_Banco: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(60)
  Referencia_pago: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  Info_Adicional?: string | null;
}
