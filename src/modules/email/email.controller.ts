import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ApiKeyGuard } from '../../guards/api-key.guard';

@Controller('email')
@UseGuards(ApiKeyGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() data: SendEmailDto) {
    const enviarA = data.enviar_a
      ? data.enviar_a.split(',').map((email) => email.trim())
      : [];

    try {
      if (enviarA.length === 0) {
        throw new BadRequestException('Debe proporcionar al menos un correo.');
      }

      // RegEx básica de validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validMails = enviarA.filter((email) => emailRegex.test(email));

      await this.emailService.sendEmail(validMails, data.asunto, data.mensaje);
      return { error: false, message: 'Correo enviado Correctamente.' };
    } catch (error) {
      return { error: true, message: 'Error al enviar correo.' };
    }
  }
}
