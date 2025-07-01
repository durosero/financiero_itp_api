import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { join } from 'path';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const oAuth2Client = new google.auth.OAuth2(
          config.get<string>('GOOGLE_CLIENT_ID'),
          config.get<string>('GOOGLE_CLIENT_SECRET'),
          config.get<string>('REDIRECT_URI'),
        );

        oAuth2Client.setCredentials({
          refresh_token: config.get<string>('GOOGLE_REFRESH_TOKEN'),
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
              user: config.get<string>('EMAIL'),
              clientId: config.get<string>('GOOGLE_CLIENT_ID'),
              clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
              refreshToken: config.get<string>('GOOGLE_REFRESH_TOKEN'),
              accessToken,
            },
          },
          defaults: {
            from: `Sigedin-ITP <${config.get<string>('EMAIL')}>`,
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
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
