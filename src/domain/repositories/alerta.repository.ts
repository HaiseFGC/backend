import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Alerta } from '../entities/alerta.entity';


@Injectable()
export class AlertaRepository {
  private repo: Repository<Alerta>;

  constructor(private dataSource: DataSource) {
  
    this.repo = this.dataSource.getRepository(Alerta);
  }


  async createAlerta(proyeccionId: number, descripcion: string): Promise<Alerta> {
    const nuevaAlerta = this.repo.create({
      descripcion,
      proyeccion: { id: proyeccionId } as any,
    });
    return this.repo.save(nuevaAlerta);
  }


  async findByProyeccionId(proyeccionId: number): Promise<Alerta[]> {
    return this.repo.find({
      where: { proyeccion: { id: proyeccionId } },
      order: { fecha: 'DESC' }
    });
  }
}