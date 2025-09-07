import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from '../auth/auth.controller';
import { Usuario } from '../domain/entities/usuario.entity';
import { Carrera } from '../domain/entities/carrera.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Carrera])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}