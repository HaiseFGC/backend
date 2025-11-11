import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface RamoMalla {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prereq: string;
}

interface AvanceRamo {
  curso: string;
  estatus: string;
}

@Injectable()
export class RamoService {
    private readonly MALLA_API = process.env.API_HAWAII_URL;
    private readonly AVANCE_API = process.env.API_UCN_URL;
    private readonly AUTH_TOKEN = process.env.API_HAWAII_AUTH_TOKEN;
  constructor(private readonly httpService: HttpService) {}

async obtenerMalla(codigoCarrera: string, catalogo: string) {
  const url = `${this.MALLA_API}?${codigoCarrera}-${catalogo}`;
  return (await firstValueFrom(
    this.httpService.get(url, { headers: { 'X-HAWAII-AUTH': this.AUTH_TOKEN } })
  )).data;
}

async obtenerAvance(rut: string, codigoCarrera: string) {
  const url = `${this.AVANCE_API}avance.php?rut=${rut}&codcarrera=${codigoCarrera}`;
  return (await firstValueFrom(this.httpService.get(url))).data;
}

  async obtenerPrerrequisitos(
    codigoRamo: string,
    codigoCarrera: string,
    catalogo: string,
  ): Promise<string[]> {
    const malla = await this.obtenerMalla(codigoCarrera, catalogo);
    const ramo = malla.find((r) => r.codigo === codigoRamo);

    if (!ramo || !ramo.prereq) return [];
    return ramo.prereq.split(',').map((p) => p.trim());
  }

  async puedeTomarse(
    rut: string,
    codigoCarrera: string,
    catalogo: string,
    codigoRamo: string,
    ramosPrevios: string[],
  ): Promise<boolean> {
    const prerrequisitos = await this.obtenerPrerrequisitos(
      codigoRamo,
      codigoCarrera,
      catalogo,
    );

    if (prerrequisitos.length === 0) return true;

    const avance = await this.obtenerAvance(rut, codigoCarrera);
    const aprobados = avance
      .filter((r) => r.estatus === 'APROBADO')
      .map((r) => r.curso);

    const ramosCumplidos = [...aprobados, ...ramosPrevios];
    return prerrequisitos.every((req) => ramosCumplidos.includes(req));
  }
}
