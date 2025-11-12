import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EstudianteService {
  private readonly MALLA_API = process.env.API_HAWAII_URL;
  private readonly AVANCE_API = process.env.API_UCN_URL;
  private readonly AUTH_TOKEN = process.env.API_HAWAII_AUTH_TOKEN;

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
      throw new HttpException(
        'No se pudo obtener la malla curricular',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getAvance(rut: string, codigoCarrera: string) {
    const url = `${this.AVANCE_API}avance.php?rut=${rut}&codcarrera=${codigoCarrera}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      
      return response.data;
    } catch (error) {
      throw new HttpException(
        'No se pudo obtener el avance curricular del estudiante',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

async getHistorial(rut: string, codigoCarrera: string, catalogo: string) {
  const avance = await this.getAvance(rut, codigoCarrera);

  if (!Array.isArray(avance)) {
    throw new HttpException('Avance no encontrado', HttpStatus.NOT_FOUND);
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
