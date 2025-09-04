import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CarreraService } from 'src/application/services/carrera.service';
import { Carrera } from 'src/domain/entities/carrera.entity';

@Controller('carreras')
export class CarreraController {
    constructor(private readonly carreraService: CarreraService) {}

    @Post('create')
    async create(@Body() dto: { codigo: string; nombre: string; catalogo: string }): Promise<Carrera> {
        return this.carreraService.create(dto);
    }

    @Get('all')
    async findAll(): Promise<Carrera[]> {
        return this.carreraService.findAll();
    } 

    @Get('codigo/:codigo')
    async findByCodigo(@Param('codigo') codigo: string): Promise<Carrera | null> {
        return this.carreraService.findByCodigo(codigo);
    }
    
}