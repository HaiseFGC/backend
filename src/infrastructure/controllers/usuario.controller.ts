import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsuarioService } from 'src/application/services/usuario.service';
import { CreateUsuarioDto } from 'src/application/dto/create-usuario.dto';
import { Usuario } from 'src/domain/entities/usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('create')
  async create(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(dto);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<Usuario | null> {
    return this.usuarioService.findByEmail(email);
  }

  @Get('rut/:rut')
  async findByRut(@Param('rut') rut: string): Promise<Usuario | null> {
    return this.usuarioService.findByRut(rut);
  }
}
