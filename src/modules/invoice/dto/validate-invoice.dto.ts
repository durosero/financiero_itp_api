import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ValidateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  readonly id_banco: number;

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  @IsNotEmpty()
  readonly referencia_pago: string;
}
