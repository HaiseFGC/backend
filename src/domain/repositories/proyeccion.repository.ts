import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Proyeccion } from '../entities/proyeccion.entity';
import { ProyeccionRamo } from '../entities/proyeccion-ramo.entity';
import { CreateProyeccionDto } from '../../application/dto/create-proyeccion.dto';

@Injectable()
export class ProyeccionRepository {
  constructor(private dataSource: DataSource) {}

  async createProyeccion(dto: CreateProyeccionDto): Promise<Proyeccion> {
    const proyeccionRepo = this.dataSource.getRepository(Proyeccion);
    const ramoRepo = this.dataSource.getRepository(ProyeccionRamo);

    // Aplanamos los ramos de todos los periodos
    const ramosEntities = dto.periodos.flatMap(periodo =>
      periodo.ramos.map(ramo =>
        ramoRepo.create({
          codigoRamo: ramo.codigoRamo,
          // --- AQUÍ ASIGNAMOS EL NOMBRE ---
          nombreAsignatura: ramo.nombreAsignatura, 
          // --------------------------------
          semestre: ramo.semestre,
          catalogo: periodo.catalogo, 
        }),
      ),
    );

    const nuevaProyeccion = proyeccionRepo.create({
      rut: dto.rut,
      nombre: dto.nombre,
      codigoCarrera: dto.codigoCarrera,
      ramos: ramosEntities,
    });

    return proyeccionRepo.save(nuevaProyeccion);
  }

  async findById(id: number): Promise<Proyeccion | null> {
    const proyeccionRepo = this.dataSource.getRepository(Proyeccion);
    return proyeccionRepo.findOne({
      where: { id },
      relations: ['ramos', 'alertas'],
    });
  }

  async findByRut(rut: string, codigoCarrera?: string): Promise<Proyeccion[]> {
    const proyeccionRepo = this.dataSource.getRepository(Proyeccion);
    const where: any = { rut };
    if (codigoCarrera) where.codigoCarrera = codigoCarrera;

    return proyeccionRepo.find({
      where,
      relations: ['ramos', 'alertas'],
      order: { fechaCreacion: 'DESC' } // Opcional: ordenar por fecha
    });
  }

  async deleteById(id: number): Promise<void> {
    const proyeccionRepo = this.dataSource.getRepository(Proyeccion);
    await proyeccionRepo.delete(id);
  }
}