import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProyeccionRepository } from 'src/domain/repositories/proyeccion.repository';
import { ProyeccionRamoRepository } from 'src/domain/repositories/proyeccion-ramo.repository';
import { AlertaRepository } from 'src/domain/repositories/alerta.repository';
import { CreateProyeccionDto } from '../dto/create-proyeccion.dto';

@Injectable()
export class ProyeccionService {
    private proyeccionRepo: ProyeccionRepository;
    private proyeccionRamoRepo: ProyeccionRamoRepository;
    private alertaRepo: AlertaRepository;

    constructor(@InjectDataSource() private dataSource: DataSource) {
        this.proyeccionRepo = new ProyeccionRepository(dataSource);
        this.proyeccionRamoRepo = new ProyeccionRamoRepository(dataSource);
        this.alertaRepo = new AlertaRepository(dataSource);
    }

    async createProyeccion(createProyeccionDto: CreateProyeccionDto) {
        const proyeccion = await this.proyeccionRepo.createProyeccion(createProyeccionDto);
        return proyeccion; 
    }

    async findAllByRut(rut: string) {
        return this.proyeccionRepo.findByRut(rut);
    }

    async findOne(id: number) {
        const proyeccion =  await this.proyeccionRepo.findById(id);
        if (!proyeccion) {
            throw new NotFoundException(`Proyeccion with ID ${id} not found`);
        }
        return proyeccion;
    }

    async deleteProyeccion (id: number){
        await this.proyeccionRepo.deleteById(id);
        return { message: 'Proyección eliminada exitosamente' };
    }

    async addAlerta(idProyeccion: number, descripcion: string) {
        return this.alertaRepo.createAlerta(idProyeccion, descripcion);
    }
}