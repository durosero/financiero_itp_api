import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @IsOptional()
  @IsString()
  from_name: string;

  @IsString()
  @IsEmail()
  enviar_a: string;

  @IsString()
  asunto: string;

  @IsString()
  mensaje: string;

  @IsString()
  @IsOptional()
  key: string;
}
