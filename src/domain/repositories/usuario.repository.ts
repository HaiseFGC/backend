import { DataSource, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

export class UsuarioRepository extends Repository<Usuario> {
  constructor(private dataSource: DataSource) {
    super(Usuario, dataSource.createEntityManager());
  }

  async createUsuario(
    email: string,
    password: string,
    rut: string,
    tipo: 'ESTUDIANTE' | 'ADMINISTRADOR',
  ): Promise<Usuario> {
    const usuario = this.create({ email, password, rut, tipo });
    return this.save(usuario);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.findOne({ where: { email } });
  }

  async findByRut(rut: string): Promise<Usuario | null> {
    return this.findOne({ where: { rut } });
  }
}
