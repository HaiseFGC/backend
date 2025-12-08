import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProyeccionService } from 'src/application/services/proyeccion.service';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { CreateProyeccionDto } from 'src/application/dto/create-proyeccion.dto';
import { RamoService } from 'src/application/services/ramo.service';
import { BadRequestException } from '@nestjs/common';
import { ProyeccionAutomaticaResponse } from 'src/application/dto/proyeccion-automatica.response';

@Resolver(() => Proyeccion)
export class ProyeccionResolver {
  constructor(
    private readonly proyeccionService: ProyeccionService,
    private readonly ramoService: RamoService,

  ) {}

  @Query(() => [Proyeccion])
  async proyeccionesPorRut(
    @Args('rut', { type: () => String }) rut: string,
    @Args('codigoCarrera', { type: () => String, nullable: true }) codigoCarrera?: string,
  ) {
    return this.proyeccionService.findAllByRut(rut, codigoCarrera);
  }

  @Query(() => Proyeccion, { nullable: true })
  async proyeccion(@Args('id', { type: () => Int }) id: number) {
    return this.proyeccionService.findOne(id);
  }

  @Query(() => ProyeccionAutomaticaResponse, { name: 'previsualizarProyeccion' })
  async previsualizarProyeccion(
    @Args('rut', { type: () => String }) rut: string,
    @Args('codigoCarrera', { type: () => String }) codigoCarrera: string,
    @Args('catalogo', { type: () => String }) catalogo: string,
  ) {
    return this.proyeccionService.simularProyeccionAutomatica(rut, codigoCarrera, catalogo);
  }

  @Mutation(() => Proyeccion)
  async crearProyeccion(
    @Args('data') data: CreateProyeccionDto
  ) {
    const { rut, codigoCarrera, periodos } = data;

    const ramosTomados: string[] = [];

  for (const periodo of periodos) {
    const { catalogo, ramos } = periodo;

    const ramosOrdenados = [...ramos].sort((a, b) => a.semestre - b.semestre);

    for (const ramo of ramosOrdenados) {
      const puedeTomarse = await this.ramoService.puedeTomarse(
        rut,
        codigoCarrera,
        catalogo,
        ramo.codigoRamo,
        ramosTomados,
      );

      if (!puedeTomarse) {
        throw new BadRequestException(
          `No se puede proyectar ${ramo.codigoRamo} en semestre ${ramo.semestre}: Prerrequisitos no cumplidos`,
        );
      }

      ramosTomados.push(ramo.codigoRamo);
    }
  }

  return this.proyeccionService.createProyeccion(data);
}


  @Mutation(() => String)
  async eliminarProyeccion(@Args('id', { type: () => Int }) id: number) {
    await this.proyeccionService.deleteProyeccion(id);
    return 'Proyección eliminada exitosamente';
  }
  


  @Mutation(() => Proyeccion)
  async guardarProyeccionAutomatica(
    @Args('rut', { type: () => String }) rut: string,
    @Args('codigoCarrera', { type: () => String }) codigoCarrera: string,
    @Args('catalogo', { type: () => String }) catalogo: string,
    @Args('nombre', { type: () => String, nullable: true }) nombre?: string,
  ) {
    return this.proyeccionService.generarYGuardarProyeccionAutomatica(
      rut, 
      codigoCarrera, 
      catalogo,
      nombre
    );
  }
}
  