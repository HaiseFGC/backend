import { Controller, Post, Body, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { CursosService } from '../../application/services/cursos.service';
import { CreateProyeccionDto } from '../../application/dto/create-proyeccion.dto'; 

@Controller('cursos')
export class CursosController {
    constructor(private readonly cursosService: CursosService) {}

    // El endpoint ahora recibe el DTO principal que agrupa toda la proyección
    @Post('inscribir')
    @HttpCode(HttpStatus.OK) // Usamos 200 OK ya que no estamos creando la inscripción aquí, solo validando/procesando
    async inscribirRamo(@Body() proyeccionData: CreateProyeccionDto) {
        
        const { rut, codigoCarrera, catalogo, ramos } = proyeccionData;

        // Iterar sobre cada ramo que el estudiante desea inscribir para validarlo
        for (const ramo of ramos) {
            const codigoAsignatura = ramo.codigoRamo;

            // 1. Validar los prerrequisitos (llamada al servicio)
            const esValido = await this.cursosService.validarInscripcion(
                rut, 
                codigoCarrera, 
                catalogo, // Se incluye el catálogo
                codigoAsignatura
            );

            if (!esValido) {
                // 2. Si la validación falla para CUALQUIER ramo, se detiene y lanza un error 400
                throw new BadRequestException(
                    `Inscripción denegada: El estudiante ${rut} no ha APROBADO todos los prerrequisitos para el ramo ${codigoAsignatura}.`
                );
            }
        }

        // 3. Si el bucle termina sin lanzar excepciones, todos los ramos son válidos
        
        // Aquí iría la lógica final para guardar la proyección o inscribir formalmente los ramos
        // Por ejemplo:
        // await this.proyeccionRepository.save(proyeccionData);

        return { 
            message: 'Inscripción exitosa. Todos los prerrequisitos han sido validados y cumplidos.', 
            data: proyeccionData 
        };
    }
}