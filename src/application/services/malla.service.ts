import { Injectable, NotFoundException } from '@nestjs/common';
import { MallaRepository } from 'src/domain/repositories/malla.repository';
import { CreateMallaDto } from 'src/application/dto/create-malla.dto';
import {Malla} from 'src/domain/entities/malla.entity';

@Injectable()
export class MallaService {
    constructor(private readonly mallaRepository: MallaRepository) {}

    async create(createMallaDto: CreateMallaDto): Promise<Malla> {
        return this.mallaRepository.createMalla(
            createMallaDto.carreraId,
            createMallaDto.codigo,
            createMallaDto.asignatura,
            createMallaDto.creditos,
            createMallaDto.nivel
        );
    }

    async findAll(): Promise<Malla[]> {
        return this.mallaRepository.findAll();
    }

    async findByCodigo(codigo: string): Promise<Malla | null> {
        const malla = await this.mallaRepository.findByCodigo(codigo);
        if (!malla) {
            throw new NotFoundException('Malla not found');
        }
        return malla;
    }

    async findByCarreraId(carreraId: number): Promise<Malla[]> {
        return this.mallaRepository.findByCarreraId(carreraId);
    }

}