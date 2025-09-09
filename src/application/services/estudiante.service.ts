import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EstudianteService {
  constructor(private readonly http: HttpService) {}

  async getMalla(codigo: string, catalogo: string) {
    const url = `https://losvilos.ucn.cl/hawaii/api/mallas?${codigo}-${catalogo}`;
    const headers = { 'X-HAWAII-AUTH': 'jf400fejof13f' };
    try {
      const response = await firstValueFrom(this.http.get(url, { headers }));
      return response.data;
    } catch {
      return [];
    }
  }

  async getAvance(rut: string, carrera: string) {
    const url = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${rut}&codcarrera=${carrera}`;
    try {
      const response = await firstValueFrom(this.http.get(url));
      return response.data;
    } catch {
      return { error: 'Avance no encontrado' };
    }
  }
}
