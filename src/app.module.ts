import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { EstudianteModule } from './infrastructure/modules/estudiante.module';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './domain/entities/usuario.entity';
import { Carrera } from './domain/entities/carrera.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    EstudianteModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'db',
      entities: [Usuario,Carrera],
      synchronize: false, // Solo para dev
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}