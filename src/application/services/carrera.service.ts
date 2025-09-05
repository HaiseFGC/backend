import { Injectable, NotFoundException } from '@nestjs/common';
import { CarreraRepository } from 'src/domain/repositories/carrera.repository';
import { CreateCarreraDto } from 'src/application/dto/create-carrera.dto';
import { Carrera } from 'src/domain/entities/carrera.entity';

@Injectable()
export class CarreraService {
    constructor(private readonly carreraRepository: CarreraRepository) {}

    async create(dto: CreateCarreraDto): Promise<Carrera> {
        return this.carreraRepository.createCarrera(dto.codigo, dto.nombre, dto.catalogo);
    }

    async findByCodigo(codigo: string): Promise<Carrera | null> {
        return this.carreraRepository.findByCodigo(codigo);
    }

    async findByNombre(nombre: string): Promise<Carrera | null> {
        return this.carreraRepository.findByNombre(nombre);
    } 

    async findAll(): Promise<Carrera[]> {
        return this.carreraRepository.findAll();
    }

}