import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Alerta } from '../entities/alerta.entity';
// Importa tu DTO si lo usas, o define los tipos necesarios

@Injectable()
export class AlertaRepository {
  private repo: Repository<Alerta>;

  constructor(private dataSource: DataSource) {
    // Inicializamos el repositorio interno
    this.repo = this.dataSource.getRepository(Alerta);
  }

  // Método personalizado para crear alertas
  async createAlerta(proyeccionId: number, descripcion: string): Promise<Alerta> {
    const nuevaAlerta = this.repo.create({
      descripcion,
      proyeccion: { id: proyeccionId } as any, // Vinculación simple por ID
      fecha: new Date(),
    });
    return this.repo.save(nuevaAlerta);
  }

  // Ejemplo de otro método si lo necesitaras
  async findByProyeccionId(proyeccionId: number): Promise<Alerta[]> {
    return this.repo.find({
      where: { proyeccion: { id: proyeccionId } },
      order: { fecha: 'DESC' }
    });
  }
}