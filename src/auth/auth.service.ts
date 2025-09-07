import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../domain/entities/usuario.entity';
import { Carrera } from '../domain/entities/carrera.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Carrera)
    private carreraRepository: Repository<Carrera>,
  ) {}

  async login(email: string, password: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['carreras'],
    });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      throw new UnauthorizedException('credenciales incorrectas');
    }

    return {
      rut: usuario.rut,
      carreras: usuario.carreras.map((carrera) => ({
        codigo: carrera.codigo,
        nombre: carrera.nombre,
        catalogo: carrera.catalogo,
      })),
    };
  }

  async validateUser(rut: string): Promise<boolean> {
    const usuario = await this.usuarioRepository.findOne({ where: { rut } });
    return !!usuario;
  }
}