import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface RamoMalla {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prereq: string; // lista separada por comas
}

interface AvanceRamo {
  course: string;
  status: string; // APROBADO o REPROBADO
}

@Injectable()
export class RamoService {
    constructor(private readonly httpService: HttpService) {}

    private readonly MALLA_API = 'https://losvilos.ucn.cl/hawaii/api/mallas';
    private readonly AVANCE_API = 'https://puclaro.ucn.cl/eross/avance/avance.php';

    async obtenerMalla(codigoCarrera: string, catalogo: string): Promise<RamoMalla[]>{
        console.log('Obteniendo malla para carrera:', codigoCarrera, catalogo);
        try{
            const url = `${this.MALLA_API}?${codigoCarrera}-${catalogo}`;
            const headers = { 'X-HAWAII-AUTH': process.env.API_HAWAII_AUTH_TOKEN };
            const response = await firstValueFrom(this.httpService.get(encodeURI(url), { headers }));
            if(!response.data || response.data.length === 0){
                console.warn('No se encontraron ramos en la malla');
                return [];
            }
            console.log('Malla obtenida con', response.data.length, 'ramos');
            return response.data;
        }catch(error){
            console.log('Error en obtener malla:', error.response?.data || error.message);
            throw new HttpException('Error al obtener malla curricula', HttpStatus.BAD_GATEWAY);
        }
    }

    async obtenerAvance(rut: string, codigoCarrera: string): Promise<AvanceRamo[]>{
        try{
            const url = `${this.AVANCE_API}?rut=${rut}&codcarrera=${codigoCarrera}`;
            const response = await firstValueFrom(this.httpService.get(url));
            return response.data;
        }catch(error){
            throw new HttpException('Error al obtener avance curricular del estudiante', HttpStatus.BAD_GATEWAY);
        }
    }

    async obtenerPrerrequisitos(codigoRamo: string, codigoCarrera: string, catalogo: string): Promise<string[]>{
        const malla = await this.obtenerMalla(codigoCarrera, catalogo);
        const ramo = malla.find((r) => r.codigo === codigoRamo);
        if(!ramo) return [];
        if(!ramo.prereq) return [];
        return ramo.prereq.split(',').map((p) => p.trim());
    }

    async puedeTomarse(rut: string, codigoCarrera: string, catalogo: string, codigoRamo: string, ramosPrevios: string[]): Promise<boolean>{
        const prerrequisitos = await this.obtenerPrerrequisitos(codigoRamo, codigoCarrera, catalogo);
        if(prerrequisitos.length === 0) return true; //Si no hay prerrequisitos

        const avance = await this.obtenerAvance(rut, codigoCarrera);
        const aprobados = avance
            .filter((r) => r.status === 'APROBADO')
            .map((r) => r.course);
        
        const ramosCumplidos = [...aprobados, ...ramosPrevios];

        return prerrequisitos.every((req) => ramosCumplidos.includes(req));
    }
}
