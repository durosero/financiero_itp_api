import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    enviar_a: string[],
    asunto: string,
    mensaje: string,
    key: string,
  ): Promise<SentMessageInfo> {
    const mailOptions: ISendMailOptions = {
      to: process.env.NODE_ENV != 'pro' ? process.env.EMAIL_TEST : enviar_a,
      subject: asunto,
      text: mensaje,
    };
    return this.mailerService.sendMail(mailOptions);
  }
}
