import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MallaService } from 'src/application/services/malla.service';
import { Malla } from 'src/domain/entities/malla.entity';

@Controller('mallas')
export class MallaController {
    constructor(private readonly mallaService: MallaService) {}

    @Post('create')
    async create(@Body() createMallaDto: any): Promise<Malla> {
        return this.mallaService.create(createMallaDto);
    }

    @Get('all')
    async findAll(): Promise<Malla[]> {
        return this.mallaService.findAll();
    }

    @Get('codigo/:codigo')
    async findByCodigo(@Param('codigo') codigo: string): Promise<Malla> {
        const malla = await this.mallaService.findByCodigo(codigo);
        if (!malla) {
            throw new Error(`Malla no encontrada`);
        }
        return malla;
    }

    @Get('carrera/:carreraId')
    async findByCarreraId(@Param('carreraId') carreraId: number): Promise<Malla[]> {
        return this.mallaService.findByCarreraId(carreraId);
    }
}