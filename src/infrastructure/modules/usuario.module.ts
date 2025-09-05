import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/domain/entities/usuario.entity';
import { UsuarioRepository } from 'src/domain/repositories/usuario.repository';
import { UsuarioService } from 'src/application/services/usuario.service';
import { UsuarioController } from '../controllers/usuario.controller';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    {
      provide: UsuarioRepository,
      useFactory: (dataSource: DataSource) => new UsuarioRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
