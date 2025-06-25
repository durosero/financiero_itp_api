import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { google } from 'googleapis';
import { join } from 'path';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [
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
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
