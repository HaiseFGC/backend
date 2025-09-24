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
}