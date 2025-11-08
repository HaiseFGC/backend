import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProyeccionService } from 'src/application/services/proyeccion.service';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { CreateProyeccionDto } from 'src/application/dto/create-proyeccion.dto';

@Resolver(() => Proyeccion)
export class ProyeccionResolver {
  constructor(private readonly proyeccionService: ProyeccionService) {}

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

  @Mutation(() => Proyeccion)
  async crearProyeccion(@Args('data') data: CreateProyeccionDto) {
    return this.proyeccionService.createProyeccion(data);
  }

  @Mutation(() => String)
  async eliminarProyeccion(@Args('id', { type: () => Int }) id: number) {
    await this.proyeccionService.deleteProyeccion(id);
    return 'Proyección eliminada exitosamente';
  }
}