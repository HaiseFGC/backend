import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProyeccionRepository } from 'src/domain/repositories/proyeccion.repository';
import { AlertaRepository } from 'src/domain/repositories/alerta.repository';
import { CreateProyeccionDto } from '../dto/create-proyeccion.dto';
import { 
  ProyeccionAutomaticaResponse, 
  SemestreProyeccionGraphQL, 
  RamoProyectadoGraphQL 
} from '../dto/proyeccion-automatica.response';
import { EstudianteService } from './estudiante.service';
import { RamoService } from './ramo.service';

@Injectable()
export class ProyeccionService {
  private proyeccionRepo: ProyeccionRepository;
  private alertaRepo: AlertaRepository;
  
  private readonly MAX_CREDITOS = 30;

  constructor(
    private dataSource: DataSource,
    private readonly estudianteService: EstudianteService,
    private readonly ramoService: RamoService,
  ) {
    this.proyeccionRepo = new ProyeccionRepository(dataSource);
    this.alertaRepo = new AlertaRepository(dataSource);
  }

  // --- MÉTODOS EXISTENTES ---

  async createProyeccion(dto: CreateProyeccionDto) {
    return this.proyeccionRepo.createProyeccion(dto);
  }

  async findAllByRut(rut: string, codigoCarrera?: string) {
    return this.proyeccionRepo.findByRut(rut, codigoCarrera);
  }

  async findOne(id: number) {
    const proyeccion = await this.proyeccionRepo.findById(id);
    if (!proyeccion) throw new NotFoundException(`Proyeccion with ID ${id} not found`);
    return proyeccion;
  }

  async deleteProyeccion(id: number) {
    await this.proyeccionRepo.deleteById(id);
    return { message: 'Proyección eliminada exitosamente' };
  }

  async addAlerta(idProyeccion: number, descripcion: string) {
    return this.alertaRepo.createAlerta(idProyeccion, descripcion);
  }

  // --- ALGORITMO DE PROYECCIÓN AUTOMÁTICA ---

  async simularProyeccionAutomatica(rut: string, codigoCarrera: string, catalogo: string): Promise<ProyeccionAutomaticaResponse> {
    
    // 1. OBTENER DATOS
    const [malla, avanceRaw] = await Promise.all([
      this.ramoService.obtenerMalla(codigoCarrera, catalogo),
      this.estudianteService.getAvance(rut, codigoCarrera)
    ]);

    if (!malla) {
      throw new NotFoundException('No se pudo cargar la malla curricular');
    }

    const avance = Array.isArray(avanceRaw) ? avanceRaw : [];

    // 2. PREPARAR ESTADO INICIAL
    const aprobadosSet = new Set<string>();
    let ultimoPeriodoRegistrado = 0;

    avance.forEach((registro: any) => {
      if (registro.status === 'APROBADO' || registro.status === 'INSCRITO') {
        aprobadosSet.add(registro.course);
      }
      
      const periodoNum = parseInt(registro.period, 10);
      if (!isNaN(periodoNum) && periodoNum > ultimoPeriodoRegistrado) {
        ultimoPeriodoRegistrado = periodoNum;
      }
    });

    // 3. CALCULAR PERIODO INICIAL
    let currentYear: number;
    let currentSem: number; 

    if (ultimoPeriodoRegistrado === 0) {
      const today = new Date();
      currentYear = today.getFullYear();
      currentSem = today.getMonth() < 6 ? 10 : 20; 
    } else {
      const year = Math.floor(ultimoPeriodoRegistrado / 100);
      const sem = ultimoPeriodoRegistrado % 100;
      
      if (sem === 20) {
        currentYear = year + 1;
        currentSem = 10;
      } else {
        currentYear = year;
        currentSem = 20;
      }
    }

    let pendientes = malla.filter((ramo: any) => !aprobadosSet.has(ramo.codigo));

    const resultadoSemestres: SemestreProyeccionGraphQL[] = [];
    let semestreRelativo = 1;
    let safeGuard = 0; 

    // 4. BUCLE DE SIMULACIÓN
    while (pendientes.length > 0 && safeGuard < 20) {
      const periodoStr = `${currentYear}${currentSem}`; 

      const candidatos = pendientes.filter((ramo: any) => {
        if (!ramo.prereq) return true; 
        const requisitos = ramo.prereq.split(',').map((r: string) => r.trim());
        return requisitos.every((req: string) => aprobadosSet.has(req));
      });

      candidatos.sort((a: any, b: any) => {
        if (a.nivel !== b.nivel) return a.nivel - b.nivel;
        return b.creditos - a.creditos;
      });

      const cargaSemestral: RamoProyectadoGraphQL[] = [];
      let creditosUsados = 0;

      for (const ramo of candidatos) {
        if (creditosUsados + ramo.creditos <= this.MAX_CREDITOS) {
          cargaSemestral.push({
            codigoRamo: ramo.codigo,
            nombreAsignatura: ramo.asignatura,
            creditos: ramo.creditos
          });
          creditosUsados += ramo.creditos;
        }
      }

      if (cargaSemestral.length > 0) {
        resultadoSemestres.push({
          periodo: periodoStr,
          semestreRelativo,
          totalCreditos: creditosUsados,
          asignaturas: cargaSemestral
        });

        cargaSemestral.forEach(c => {
          aprobadosSet.add(c.codigoRamo);
          pendientes = pendientes.filter((p: any) => p.codigo !== c.codigoRamo);
        });
      } else {
        break;
      }

      semestreRelativo++;
      safeGuard++;
      
      if (currentSem === 10) {
        currentSem = 20;
      } else {
        currentSem = 10;
        currentYear++;
      }
    }

    return { semestres: resultadoSemestres };
  }

  // === GENERAR Y GUARDAR ===

  async generarYGuardarProyeccionAutomatica(
    rut: string, 
    codigoCarrera: string, 
    catalogo: string, 
    nombrePersonalizado?: string
  ) {
    const simulacion = await this.simularProyeccionAutomatica(rut, codigoCarrera, catalogo);

    // Array tipado para evitar error 'never'
    const ramosParaGuardar: { codigoRamo: string; nombreAsignatura: string; semestre: number }[] = [];

    simulacion.semestres.forEach(semestre => {
      semestre.asignaturas.forEach(asignatura => {
        ramosParaGuardar.push({
          codigoRamo: asignatura.codigoRamo,
          nombreAsignatura: asignatura.nombreAsignatura,
          semestre: semestre.semestreRelativo, 
        });
      });
    });

    const dto: CreateProyeccionDto = {
      rut,
      codigoCarrera,
      nombre: nombrePersonalizado || `Proyección Auto ${new Date().toLocaleDateString()}`,
      periodos: [
        {
          catalogo: catalogo,
          ramos: ramosParaGuardar
        }
      ]
    };

    return this.createProyeccion(dto);
  }
}