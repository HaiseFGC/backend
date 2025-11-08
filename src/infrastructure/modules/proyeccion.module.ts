// src/infrastructure/modules/proyeccion.module.ts
import { Module } from '@nestjs/common';
import { ProyeccionController } from '../controllers/proyeccion.controller';
import { ProyeccionService } from 'src/application/services/proyeccion.service';
import { ProyeccionResolver } from '../resolvers/proyeccion.resolver'; // 1. IMPORTA el resolver
import { EstudianteModule } from './estudiante.module'; // 2. IMPORTA EstudianteModule para acceder a su servicio

@Module({
  imports: [EstudianteModule], // 3. AÑADE EstudianteModule aquí
  controllers: [ProyeccionController],
  providers: [
    ProyeccionService,
    ProyeccionResolver, // 4. AÑADE el resolver a los providers
  ],
})
export class ProyeccionModule {}