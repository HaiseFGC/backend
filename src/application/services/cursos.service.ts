// src/application/services/cursos.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { ProyeccionRamoRepository } from '../../domain/repositories/proyeccion-ramo.repository';
import axios from 'axios';

@Injectable()
export class CursosService {
    // Inyectamos el repositorio para consultar el avance local del estudiante
    constructor(
        private readonly proyeccionRamoRepository: ProyeccionRamoRepository,
    ) {}

    /**
     * Valida si un estudiante puede inscribir una asignatura verificando sus prerrequisitos.
     * @param rut RUT del estudiante.
     * @param codigoCarrera Código de la carrera (necesario para la Malla).
     * @param codigoAsignatura Código de la asignatura a inscribir (ej: DCCB-00246).
     */
    async validarInscripcion(rut: string, codigoCarrera: string, codigoAsignatura: string): Promise<boolean> {
        
        // 1. OBTENER PRERREQUISITOS de la Asignatura desde la Malla Externa
        const urlMalla = `https://losvilos.ucn.cl/hawaii/api/mallas?${codigoCarrera}-202320`; // Usar un catálogo genérico, ajusta si es necesario

        let malla: any[] = [];
        try {
            const response = await axios.get(urlMalla, {
                headers: { 'X-HAWAII-AUTH': 'jf400fejof13f' } // Usamos el token de ejemplo
            });
            malla = response.data;
        } catch (error) {
            // Manejar error de conexión o API
            throw new BadRequestException('No se pudo obtener la información de la Malla Curricular.');
        }
        
        // Buscar la asignatura y sus prerrequisitos
        const asignaturaAInscribir = malla.find(curso => curso.codigo === codigoAsignatura);

        if (!asignaturaAInscribir) {
            throw new BadRequestException(`Asignatura con código ${codigoAsignatura} no encontrada en la malla.`);
        }

        // Dividir los prerrequisitos (ej: "DCCB-00142,DCCB-00200")
        const prerequisitosString = asignaturaAInscribir.prereq;
        if (!prerequisitosString) {
            return true; // No tiene prerrequisitos, es válida.
        }

        const prerequisitosRequeridos = prerequisitosString.split(',');
        
        // 2. VERIFICAR EL AVANCE del estudiante para cada prerrequisito
        for (const prereqCodigo of prerequisitosRequeridos) {
            
            // Opción 1: Si tienes el avance localmente (usando tu repositorio)
            // Esto requiere que hayas sincronizado el avance con tu tabla 'proyeccion_ramo'
            const avanceLocal = await this.proyeccionRamoRepository.findOne({
                where: {
                    // Ajusta las propiedades de tu entidad para buscar el curso y el estudiante
                    student: rut,
                    course: prereqCodigo,
                    status: 'APROBADO', // Solo buscamos si está APROBADO
                },
            });

            if (!avanceLocal) {
                // Opción 2: Si necesitas consultar el avance en el endpoint externo de la UCN
                /*
                const urlAvance = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${rut}&codcarrera=${codigoCarrera}`;
                const responseAvance = await axios.get(urlAvance);
                const avanceExterno = responseAvance.data.find(a => a.course === prereqCodigo && a.status === 'APROBADO');

                if (!avanceExterno) {
                    return false; // El prerrequisito no está aprobado.
                }
                */

                // Nos quedamos con la validación local si no está APROBADO, retornamos false
                return false; 
            }
        }

        // Si el ciclo termina, todos los prerrequisitos están APROBADOS
        return true;
    }
}