import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { UcnModule } from './ucn/ucn.module';
import { EstudianteModule } from './infrastructure/modules/estudiante.module';
import { Usuario } from './domain/entities/usuario.entity';
import { Carrera } from './domain/entities/carrera.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'db',
      entities: [Usuario,Carrera],
      synchronize: true, // Solo para dev
    }),
    UcnModule, // Módulo para integrar los endpoints
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}