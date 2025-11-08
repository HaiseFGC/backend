// src/infrastructure/modules/estudiante.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EstudianteController } from '../controllers/estudiante.controller';
import { EstudianteService } from 'src/application/services/estudiante.service';

@Module({
  imports: [HttpModule], // Necesario porque EstudianteService usa HttpService
  controllers: [EstudianteController],
  providers: [EstudianteService],
  // --- ESTA LÍNEA ES LA SOLUCIÓN CLAVE ---
  // Hacemos que EstudianteService esté disponible para otros módulos que importen EstudianteModule.
  exports: [EstudianteService], 
})
export class EstudianteModule {}