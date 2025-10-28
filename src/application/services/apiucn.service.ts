import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
// Implementamos OnModuleInit
export class ApiUcnService implements OnModuleInit {
    
    private MALLAS_BASE_URL: string;
    private HAWAII_AUTH_TOKEN: string; 

    constructor(private configService: ConfigService) {}

    /**
     * Hook de ciclo de vida que se ejecuta después de que todas las dependencias 
     * del módulo se han resuelto. Garantiza que ConfigService esté listo.
     */
    onModuleInit() {
        // 1. Asignación de variables de entorno de forma segura
        const baseUrl = this.configService.get<string>('API_MALLAS_BASE_URL');
        const authToken = this.configService.get<string>('API_HAWAII_AUTH_TOKEN');

        // 2. Validación estricta: Si falta alguna variable crítica, lanzamos un error que detiene el inicio
        if (!baseUrl || !authToken) {
            console.error('ERROR: Faltan variables de entorno críticas (API_MALLAS_BASE_URL o API_HAWAII_AUTH_TOKEN).');
            // Idealmente, deberías lanzar un error de forma síncrona para que la aplicación no inicie
            throw new Error('Configuración de API externa incompleta.');
        }
        
        this.MALLAS_BASE_URL = baseUrl;
        this.HAWAII_AUTH_TOKEN = authToken;
    }

    /**
     * 1. Consulta la Malla Curricular externa para una carrera y catálogo específicos.
     * @param codigoCarrera El código de la carrera (ej: '8266').
     * @param catalogo La versión de la malla (ej: '202410').
     * @returns Una promesa que resuelve a un array de objetos de asignatura.
     */
    async getMallaCurricular(codigoCarrera: string, catalogo: string): Promise<any[]> {
        
        // Se asegura que las variables ya fueron asignadas en onModuleInit
        const urlMalla = `${this.MALLAS_BASE_URL}?${codigoCarrera}-${catalogo}`; 
        
        const configMalla: AxiosRequestConfig = {
            headers: { 'X-HAWAII-AUTH': this.HAWAII_AUTH_TOKEN }
        };

        try {
            const response = await axios.get(urlMalla, configMalla);
            return response.data;
        } catch (error) {
            console.error('Error al obtener Malla Curricular:', error.message);
            throw new BadRequestException('Error de conexión o datos no encontrados en el sistema de Mallas Curriculares.');
        }
    }
    
    /**
     * 2. Consulta el Avance Curricular externo para un estudiante específico.
     * Asumimos que ApiUcnConfig contiene la URL base del servicio de Avance.
     */
    // Este método se agregará en el Paso 3.
}