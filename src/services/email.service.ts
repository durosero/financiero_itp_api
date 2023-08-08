import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { BlobOptions } from 'buffer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendCustomMail(mailOptions: ISendMailOptions): Promise<boolean> {
    // const mailOptions: ISendMailOptions = {
    //   to: 'durosero@itp.edu.co',
    //   subject: 'Mensaje de prueba',
    //   // 'html': dataMail.mensaje
    //   text: 'hola mundo',
    //   // attachments: fileBuffer,
    // };

    try {
      await this.mailerService.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error al enviar el email:', error);
      return false;
    }
  }
}
