import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EConnection } from 'src/constants/database.constant';
import { AUTH_EMAIL } from 'src/constants/email.constant';
import { EmailService } from '../../services/email.service';
import { CashController } from './cash.controller';
import { Concept } from './entities/concept.entity';
import { DetailInvoice } from './entities/detailInvoice.entity';
import { DetailPayment } from './entities/detailPayment.entity';
import { FormOfPayment } from './entities/formOfPayment.entity';
import { Invoice } from './entities/invoice.entity';
import { Person } from './entities/person.entity';
import { StatusPayment } from './entities/statusPayment.entity';
import { DetailInvoiceSys } from './entities/SysApolo/detailInvoiceSys.entity';
import { InvoiceSys } from './entities/SysApolo/invoiceSys.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { ValidateTokenMiddleware } from './middlewares/validateToken.middleware';
import { DetailPaymentRepository } from './repositories/detailPayment.repository';

@Module({
  controllers: [InvoiceController, CashController],
  providers: [InvoiceService, EmailService, DetailPaymentRepository],
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      DetailInvoice,
      FormOfPayment,
      StatusPayment,
      Concept,
      DetailPayment,
      Person,
    ]),
    TypeOrmModule.forFeature(
      [InvoiceSys, DetailInvoiceSys],
      EConnection.SYSAPOLO,
    ),
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
export class InvoiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateTokenMiddleware).forRoutes({
      path: 'caja/reverso',
      method: RequestMethod.POST,
    });
  }
}
