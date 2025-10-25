import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class CursosService {
    // 1. Función principal de validación
    async validarInscripcion(rut: string, codigoAsignatura: string): boolean {
        // 2. Obtener prerrequisitos de la asignatura
        const asignatura = await this.mallasRepo.findOne({ where: { codigo: codigoAsignatura } });
        if (!asignatura || !asignatura.prerequisitos) {
            // Si no tiene prerrequisitos, es válida la inscripción
            return true;
        }

        const prerequisitosRequeridos = asignatura.prerequisitos.split(','); // Por ejemplo: ['DCCB-00142']
        
        // 3. Verificar el avance del estudiante para cada prerrequisito
        for (const prereqCodigo of prerequisitosRequeridos) {
            const avance = await this.avanceRepo.findOne({ 
                where: { 
                    student: rut, 
                    course: prereqCodigo 
                } 
            });

            // Lógica clave: El prerrequisito debe estar APROBADO
            if (!avance || avance.status !== 'APROBADO') {
                // Si el prerrequisito no existe o no está aprobado, la validación falla
                return false; 
            }
        }

        // Si todos los prerrequisitos se encuentran y están APROBADOS
        return true;
    }

    // Nota: Necesitarás inyectar (inyectar) tus repositorios de Mallas y Avance (por ejemplo, TypeORM, Mongoose, o usando los endpoints externos).
}