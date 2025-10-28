import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ProyeccionService } from 'src/application/services/proyeccion.service';
import { CreateProyeccionDto } from 'src/application/dto/create-proyeccion.dto';

@Controller('proyecciones')
export class ProyeccionController {
    constructor(private readonly proyeccionService: ProyeccionService) {}


    @Post('createProyeccion')
    async createProyeccion(@Body() createProyeccionDto: CreateProyeccionDto) {
        return this.proyeccionService.createProyeccion(createProyeccionDto);
    }

    @Get('usuario/:rut')
    async findAllByRut(@Param('rut') rut: string) {
        return this.proyeccionService.findAllByRut(rut);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.proyeccionService.findOne(id);
    }

    @Delete(':id')
    async deleteProyeccion(@Param('id') id: number) {
        return this.proyeccionService.deleteProyeccion(id);
    }

}