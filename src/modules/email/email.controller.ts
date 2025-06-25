import { Controller, Post, Body, UseGuards } from '@nestjs/common';
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

    return this.emailService.sendEmail(
      enviarA,
      data.asunto,
      data.mensaje,
      data.key,
    );
  }
}
