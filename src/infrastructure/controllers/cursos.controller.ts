// src/infrastructure/controllers/cursos.controller.ts

import { Controller, Post, Body, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { CursosService } from '../../application/services/cursos.service';
import { CreateProyeccionRamoDto } from '../../application/dto/create-proyeccion-ramo.dto'; 
// Asumo que tienes un DTO para la inscripción (cambia el nombre si es diferente)

@Controller('cursos')
export class CursosController {
    constructor(private readonly cursosService: CursosService) {}

    @Post('inscribir')
    @HttpCode(HttpStatus.CREATED) // Usamos 201 Created para una inscripción exitosa
    async inscribirRamo(@Body() inscripcionData: CreateProyeccionRamoDto) {
        
        // Los datos del DTO deben incluir RUT, CODIGO CARRERA y CODIGO ASIGNATURA
        const { rut, codigoCarrera, codigoAsignatura } = inscripcionData;

        // 1. Validar los prerrequisitos
        const esValido = await this.cursosService.validarInscripcion(
            rut, 
            codigoCarrera, 
            codigoAsignatura
        );

        if (!esValido) {
            // 2. Si la validación falla, lanzamos una excepción 400 Bad Request
            throw new BadRequestException(
                `La inscripción falló: el estudiante con RUT ${rut} no ha APROBADO todos los prerrequisitos para ${codigoAsignatura}.`
            );
        }

        // 3. Si la validación es exitosa, se puede proceder con la lógica de inscripción
        // (Llama a otro service/repository para guardar la inscripción en la DB)
        // Ejemplo:
        // await this.proyeccionService.crearNuevaInscripcion(inscripcionData);

        return { 
            message: 'Inscripción exitosa. Prerrequisitos validados y cumplidos.', 
            data: inscripcionData 
        };
    }
}