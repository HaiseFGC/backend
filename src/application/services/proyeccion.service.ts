import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProyeccionRepository } from 'src/domain/repositories/proyeccion.repository';
import { AlertaRepository } from 'src/domain/repositories/alerta.repository';
import { CreateProyeccionDto } from '../dto/create-proyeccion.dto';
// Grapql imports for the new method
import { EstudianteService } from './estudiante.service';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { ProyeccionRamo } from 'src/domain/entities/proyeccion-ramo.entity';

// Función auxiliar para parsear prerrequisitos (puedes mejorarla)
const parsePrerequisitos = (prereqStr: string): string[] => {
  if (!prereqStr || prereqStr.toUpperCase() === 'SIN REQUISITOS') return [];
  return prereqStr.replace(/[()]/g, '').split(/\s+(?:Y|O)\s+/).map(r => r.trim());
};


@Injectable()
export class ProyeccionService {
  private proyeccionRepo: ProyeccionRepository;
  private alertaRepo: AlertaRepository;

  constructor(
    private dataSource: DataSource,
    // INYECTA EL SERVICIO DE ESTUDIANTE
    private estudianteService: EstudianteService,
  ) {
    this.proyeccionRepo = new ProyeccionRepository(dataSource);
    this.alertaRepo = new AlertaRepository(dataSource);
  }


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
// ---- ¡NUEVO MÉTODO PARA EL ALGORITMO! ----
  async generarProyeccionAutomatica(
    rut: string,
    codigoCarrera: string,
    catalogoCarrera: string,
  ): Promise<Proyeccion> {
    console.log(`Generando proyección para RUT: ${rut}, Carrera: ${codigoCarrera}`);

    // 1. Obtener los datos necesarios
    const malla = await this.estudianteService.getMalla(codigoCarrera, catalogoCarrera);
    const avance = await this.estudianteService.getAvance(rut, codigoCarrera);

    // 2. Extraer los ramos ya aprobados
    const ramosAprobados = new Set(
        Array.isArray(avance) ? avance.filter(a => a.status === 'APROBADO').map(a => a.course) : []
    );
    
    // =======================================================================
    // == AQUÍ IRÁ TU ALGORITMO COMPLEJO PARA EL "CAMINO MÁS CORTO" ==
    // Por ahora, devolveremos una proyección simulada para probar.
    // =======================================================================

    // Lógica simulada: tomar los primeros 5 ramos de la malla que no estén aprobados
    const ramosParaProyectar = malla
      .filter(ramo => !ramosAprobados.has(ramo.codigo))
      .slice(0, 5) // Tomamos solo 5 para el ejemplo
      .map((ramo, index) => ({
        id: index + 1, // ID simulado
        codigoRamo: ramo.codigo,
        semestre: 1, // Todos en el primer semestre de la proyección
      }));

    // 3. Construir el objeto de respuesta
    const proyeccionResultante: Proyeccion = {
      id: 0, // No tiene un ID real de la BD
      rut: rut,
      nombre: `Proyección Automática - ${new Date().toLocaleDateString()}`,
      codigoCarrera: codigoCarrera,
      fechaCreacion: new Date(),
      ramos: ramosParaProyectar,
      alertas: [],
    };

    return proyeccionResultante;
  }
}
