import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AUTH_EMAIL } from '../../constants/email.constant';
import { BbvaCashController } from './bbvaCash.controller';
import { BankAccount } from './entities/bankAccount.entity';
import { CategoryInvoice } from './entities/categoryInvoice.entity';
import { Concept } from './entities/concept.entity';
import { DetailInvoice } from './entities/detailInvoice.entity';
import { DetailPayment } from './entities/detailPayment.entity';
import { DiscountCategory } from './entities/discountCategory.entity';
import { Discounts } from './entities/discounts.entity';
import { DocumentType } from './entities/documentType.entity';
import { FormOfPayment } from './entities/formOfPayment.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceDiscounts } from './entities/invoiceDiscounts.entity';
import { Package } from './entities/package.entity';
import { PackageConfiguration } from './entities/packageConfiguration.entity';
import { PackageDetail } from './entities/packageDetail.entity';
import { Person } from './entities/person.entity';
import { RequestLog } from './entities/requestLog.entity';
import { StatusPayment } from './entities/statusPayment.entity';
import { UniversityPeriod } from './entities/univsityPeriod.entity';
import { InvoiceController } from './invoice.controller';
import { BbvaAuthMiddleware } from './middlewares/bbvaAuth.middleware';
import { ValidateTokenMiddleware } from './middlewares/validateToken.middleware';
import { PopularCashController } from './popularCash.controller';
import { ConfigRepository } from './repositories/config.repository';
import { DetailPaymentRepository } from './repositories/detailPayment.repository';
import { DiscountRepository } from './repositories/discount.repository';
import { InvoiceRepository } from './repositories/invoice.repository';
import { PackageRepository } from './repositories/package.repository';
import { ConsultInvoiceService } from './services/consultInvoice.service';
import { EnrollmentService } from './services/enrollment.service';
import { GenerateInvoiceService } from './services/generateInvoice.service';
import { InvoiceService } from './services/invoice.service';
import { InvoiceSysService } from './services/invoiceSys.service';
import { RequestLogService } from './services/requestLog.service';
import { google } from 'googleapis';

@Module({
  controllers: [InvoiceController, PopularCashController, BbvaCashController],
  providers: [
    InvoiceService,
    InvoiceSysService,
    ConsultInvoiceService,
    GenerateInvoiceService,
    DetailPaymentRepository,
    InvoiceRepository,
    PackageRepository,
    ConfigRepository,
    DiscountRepository,
    RequestLogService,
    EnrollmentService,
  ],
  exports: [
    InvoiceRepository,
    InvoiceSysService,
    InvoiceService,
    DetailPaymentRepository,
  ],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Invoice,
      DetailInvoice,
      FormOfPayment,
      StatusPayment,
      Concept,
      DetailPayment,
      Person,
      DocumentType,
      CategoryInvoice,
      BankAccount,
      Package,
      PackageConfiguration,
      PackageDetail,
      Discounts,
      DiscountCategory,
      UniversityPeriod,
      InvoiceDiscounts,
      RequestLog,
    ]),

    MailerModule.forRootAsync({
      useFactory: async () => {
        const oAuth2Client = new google.auth.OAuth2(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          process.env.REDIRECT_URI,
        );

        oAuth2Client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
        });

        const accessToken = (await oAuth2Client.getAccessToken()).token;

        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              type: 'OAuth2',
              user: process.env.EMAIL ?? '',
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.REFRESH_TOKEN,
              accessToken,
            },
          },
          defaults: {
            from: `Sigedin-ITP <${process.env.EMAIL}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            options: {
              strict: false,
            },
          },
        };
      },
    }),
  ],
})
export class InvoiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateTokenMiddleware).forRoutes({
      path: 'caja/reverso',
      method: RequestMethod.POST,
    });
    consumer.apply(ValidateTokenMiddleware).forRoutes({
      path: 'caja/registrarpago',
      method: RequestMethod.POST,
    });
    consumer.apply(BbvaAuthMiddleware).forRoutes({
      path: 'caja/bbva/consultarfactura',
      method: RequestMethod.POST,
    });
    consumer.apply(BbvaAuthMiddleware).forRoutes({
      path: 'caja/bbva/registrarpagos',
      method: RequestMethod.POST,
    });
    consumer.apply(BbvaAuthMiddleware).forRoutes({
      path: 'caja/bbva/reversarpagos',
      method: RequestMethod.POST,
    });
  }
}
