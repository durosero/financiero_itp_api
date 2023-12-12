import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class SendPaymentDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    return value == true;
  })
  important?: boolean;
}
