import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProyeccionRepository } from 'src/domain/repositories/proyeccion.repository';
import { AlertaRepository } from 'src/domain/repositories/alerta.repository';
import { CreateProyeccionDto } from '../dto/create-proyeccion.dto';

@Injectable()
export class ProyeccionService {
  private proyeccionRepo: ProyeccionRepository;
  private alertaRepo: AlertaRepository;

  constructor(private dataSource: DataSource) {
    this.proyeccionRepo = new ProyeccionRepository(dataSource);
    this.alertaRepo = new AlertaRepository(dataSource);
  }

  async createProyeccion(dto: CreateProyeccionDto) {
    return this.proyeccionRepo.createProyeccion(dto);
  }

  async findAllByRut(rut: string, codigoCarrera?: string) {
    return this.proyeccionRepo.findByRut(rut, codigoCarrera);
  }

  async findOne(id: number) {
    const proyeccion = await this.proyeccionRepo.findById(id);
    if (!proyeccion) throw new NotFoundException(`Proyeccion with ID ${id} not found`);
    return proyeccion;
  }

  async deleteProyeccion(id: number) {
    await this.proyeccionRepo.deleteById(id);
    return { message: 'Proyección eliminada exitosamente' };
  }

  async addAlerta(idProyeccion: number, descripcion: string) {
    return this.alertaRepo.createAlerta(idProyeccion, descripcion);
  }
}
