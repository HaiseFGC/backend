import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EstudianteService {
  private readonly MALLA_API = process.env.API_HAWAII_URL;
  private readonly AVANCE_API = process.env.API_UCN_URL;
  private readonly AUTH_TOKEN = process.env.API_HAWAII_AUTH_TOKEN;
  
  // Agregamos Logger para depuración
  private readonly logger = new Logger(EstudianteService.name);

  constructor(private readonly httpService: HttpService) {}

  async getMalla(codigo: string, catalogo: string) {
    const url = `${this.MALLA_API}?${codigo}-${catalogo}`;
    const headers = { 'X-HAWAII-AUTH': this.AUTH_TOKEN };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error obteniendo malla: ${error.message}`);
      throw new HttpException(
        'No se pudo obtener la malla curricular',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // === AQUÍ ESTÁ LA CORRECCIÓN PRINCIPAL ===
  async getAvance(rut: string, codigoCarrera: string) {
    const url = `${this.AVANCE_API}avance.php?rut=${rut}&codcarrera=${codigoCarrera}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      // 1. Si es un Array válido, lo devolvemos tal cual.
      if (Array.isArray(data)) {
        return data;
      }

      // 2. Si NO es un Array (ej: null, "no data", false), devolvemos array vacío.
      // Esto evita que ProyeccionService falle con "forEach is not a function".
      this.logger.warn(`API Avance devolvió formato no válido para RUT ${rut}: ${JSON.stringify(data)}. Se asume alumno nuevo o sin historial.`);
      return [];

    } catch (error) {
      this.logger.error(`Error conectando a API Avance: ${error.message}`);
      throw new HttpException(
        'No se pudo obtener el avance curricular del estudiante',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getHistorial(rut: string, codigoCarrera: string, catalogo: string) {
    // getAvance ahora siempre devuelve un array (vacío o lleno), así que es seguro.
    const avance = await this.getAvance(rut, codigoCarrera);

    // Si está vacío, devolvemos objeto vacío directamente
    if (avance.length === 0) {
      return {};
    }

    // Ordenar los registros por período (numéricamente, más antiguo primero)
    const sorted = [...avance].sort((a, b) => Number(a.period) - Number(b.period));

    // Agrupar por período
    const grouped = sorted.reduce((acc, item) => {
      if (!acc[item.period]) acc[item.period] = [];
      acc[item.period].push({
        nrc: item.nrc,
        codigo: item.course,
        estado: item.status,
        excluido: item.excluded,
        tipo: item.inscriptionType
      });
      return acc;
    }, {} as Record<string, any[]>);

    return grouped;
  }
}