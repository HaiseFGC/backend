import { Controller, Param, Get } from '@nestjs/common';
import { EstudianteService } from 'src/application/services/estudiante.service';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudiantesService: EstudianteService) {}
  
  @Get('malla/:codigo/:catalogo') //MODIFICAR O ARREGLARLOS PARA EL NUEVO SPRINT
  async getMalla(
    @Param('codigo') codigo: string,
    @Param('catalogo') catalogo: string,
  ) {
    return this.estudiantesService.getMalla(codigo, catalogo);
  }

  @Get('avance/:rut/:carrera') //MODIFICAR O ARREGLARLOS PARA EL NUEVO SPRINT
  async getAvance(
    @Param('rut') rut: string,
    @Param('carrera') carrera: string,
  ) {
    return this.estudiantesService.getAvance(rut, carrera);
  }


  @Get('proyeccion-data/:rut/:codCarrera/:catalogo')
  async getProyeccionData(
    @Param('rut') rut: string,
    @Param('codCarrera') codCarrera: string,
    @Param('catalogo') catalogo: string,
  ) {
    const malla = await this.estudiantesService.getMalla(codCarrera, catalogo);
    const avance = await this.estudiantesService.getAvance(rut, codCarrera);

    const aprobados = new Set(
      avance.filter(a => a.status === 'APROBADO').map(a => a.course)
    );

    const ramosLiberados = malla.filter(ramo => {
      if (!ramo.prereq) return true;
      const prereqs = ramo.prereq.split(',');
      return prereqs.every(p => aprobados.has(p));
    })

    return { malla, avance, ramosLiberados };
  }
  


}