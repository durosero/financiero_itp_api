import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendEmail(
    enviar_a: string[],
    asunto: string,
    mensaje: string,
  ): Promise<SentMessageInfo> {
    const mailOptions: ISendMailOptions = {
      to:
        this.configService.get<string>('NODE_ENV') != 'pro'
          ? this.configService.get<string>('EMAIL_TEST')
          : enviar_a,
      subject: asunto,
      text: mensaje,
    };
    return this.mailerService.sendMail(mailOptions);
  }
}
