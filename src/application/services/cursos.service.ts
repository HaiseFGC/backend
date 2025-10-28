import { Injectable, BadRequestException } from '@nestjs/common';
import { ApiUcnService } from './apiucn.service'; //  Importamos el nuevo servicio

@Injectable()
export class CursosService {
    
    // Inyectamos el servicio que maneja la comunicación con APIs externas
    constructor(private readonly ApiUcnService: ApiUcnService) {}

    /**
     * Valida si un estudiante puede inscribir una asignatura verificando sus prerrequisitos.
     */
    async validarInscripcion(rut: string, codigoCarrera: string, catalogo: string, codigoAsignatura: string): Promise<boolean> {
        
        // --- 1. OBTENER PRERREQUISITOS de la Asignatura (Usando ApiUcnService) ---
        
        const malla = await this.ApiUcnService.getMallaCurricular(codigoCarrera, catalogo);

        const asignaturaAInscribir = malla.find(curso => curso.codigo === codigoAsignatura);

        if (!asignaturaAInscribir) {
            throw new BadRequestException(`Asignatura con código ${codigoAsignatura} no encontrada en la malla ${codigoCarrera}-${catalogo}.`);
        }

        const prerequisitosString = asignaturaAInscribir.prereq;
        if (!prerequisitosString) {
            return true; // No tiene prerrequisitos.
        }

        const prerequisitosRequeridos = prerequisitosString.split(',');
        
        // --- 2. VERIFICAR EL AVANCE del estudiante (Pendiente de implementar en el Paso 3) ---
        
        // Aquí iría la lógica para consultar el avance y verificar cada prerequisito
        // ... (continuará en el siguiente paso)
        
        // Por ahora, asumimos que la validación falla si hay prerrequisitos y no hay lógica de avance
        return false; 
    }
}
