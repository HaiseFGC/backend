import { NestFactory } from '@nestjs/core';
import { EstudianteModule } from './infrastructure/modules/estudiante.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EstudianteModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();