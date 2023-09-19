import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
    }),
  );

  await app.listen(PORT);
}
bootstrap();
