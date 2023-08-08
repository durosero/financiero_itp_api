import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { DetailInvoice } from './entities/detailInvoice.entity';
import { FormOfPayment } from './entities/formOfPayment.entity';
import { StatusPayment } from './entities/statusPayment.entity';
import { Concept } from './entities/concept.entity';
import { DetailPayment } from './entities/detailPayment.entity';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from '../../services/email.service';
import { AUTH_EMAIL } from 'src/constants/email.constant';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, EmailService],
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      DetailInvoice,
      FormOfPayment,
      StatusPayment,
      Concept,
      DetailPayment,
    ]),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          service: 'gmail',
          auth: {
            user: process.env.EMAIL ?? '',
            pass: process.env.EMAIL_PASS ?? '',
          },
        },
        defaults: {
          from: `Sigedin-ITP <${AUTH_EMAIL.USER}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
})
export class InvoiceModule {}
