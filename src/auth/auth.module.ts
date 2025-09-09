import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from '../auth/auth.controller';
import { Usuario } from '../domain/entities/usuario.entity';
import { Carrera } from '../domain/entities/carrera.entity';

@Module({
  imports: [HttpModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}