import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from 'src/domain/repositories/usuario.repository';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Usuario } from 'src/domain/entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    // 🔒 pendiente: aplicar hash a la password
    return this.usuarioRepository.createUsuario(
      dto.email,
      dto.password,
      dto.rut,
      dto.tipo,
    );
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findByEmail(email);
  }

  async findByRut(rut: string): Promise<Usuario | null> {
    return this.usuarioRepository.findByRut(rut);
  }
}
