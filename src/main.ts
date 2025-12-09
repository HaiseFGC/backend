import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './infrastructure/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Esto protege tu API de datos basura o malintencionados
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true, 
  }));

  // Esto evita que el usuario vea errores 500 feos o stack traces
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: config.get('FRONTEND_URL') || 'http://localhost:5173',
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();