import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

export const PORT = process.env.PORT;
export const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
export const PREFIX = process.env.GLOBAL_PEFIX ?? '/api/v2';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(bodyParser.urlencoded({ extended: true }));

  const config = new DocumentBuilder()
    .setTitle('API ITP')
    .setDescription('Basic documentation for barcode payment implementation')
    .setVersion('1.0')
    .addServer('https://staging.itp.edu.co/', 'Staging')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v2/api-docs', app, document);

  await app.listen(PORT);
}
bootstrap();
