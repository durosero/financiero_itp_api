import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 2,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  readonly id_banco: number;

  @ApiProperty({
    example: '31255',
    required: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  @IsNotEmpty()
  readonly referencia_pago: string;
}
