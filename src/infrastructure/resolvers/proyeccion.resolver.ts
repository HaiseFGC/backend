// src/infrastructure/resolvers/proyeccion.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProyeccionService } from 'src/application/services/proyeccion.service';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt-auth.guard';

@Resolver(() => Proyeccion)
export class ProyeccionResolver {
  constructor(private proyeccionService: ProyeccionService) {}

  // ---- Query para obtener una proyección por ID (ejemplo) ----
  @Query(() => Proyeccion, { name: 'proyeccion' })
  @UseGuards(JwtAuthGuard) // Protegemos el endpoint
  async getProyeccion(@Args('id', { type: () => Int }) id: number) {
    return this.proyeccionService.findOne(id);
  }

  // ---- ¡LA NUEVA QUERY PARA LA PROYECCIÓN AUTOMÁTICA! ----
  // Devuelve una entidad 'Proyeccion' que es el resultado del cálculo
  @Query(() => Proyeccion, { name: 'generarProyeccionAutomatica' })
  @UseGuards(JwtAuthGuard)
  async generarProyeccionAutomatica(
    @Args('rut') rut: string,
    @Args('codigoCarrera') codigoCarrera: string,
    @Args('catalogoCarrera') catalogoCarrera: string,
  ) {
    return this.proyeccionService.generarProyeccionAutomatica(rut, codigoCarrera, catalogoCarrera);
  }
}