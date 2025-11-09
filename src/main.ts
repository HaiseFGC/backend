import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { EstudianteModule } from './infrastructure/modules/estudiante.module';
import { Module } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // habilita CORS para que el frontend pueda llamar al backend
  app.enableCors({
    origin: 'http://localhost:5173', // puerto donde corre tu frontend (Vite/React)
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();