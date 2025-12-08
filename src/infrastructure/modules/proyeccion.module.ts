import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { ProyeccionRamo } from 'src/domain/entities/proyeccion-ramo.entity';
import { Alerta } from 'src/domain/entities/alerta.entity';
import { ProyeccionService } from 'src/application/services/proyeccion.service';
import { ProyeccionController } from '../controllers/proyeccion.controller';
import { ProyeccionResolver } from '../graphql/resolvers/proyeccion.resolver';
import { RamoService } from 'src/application/services/ramo.service';
import { EstudianteModule } from './estudiante.module';


@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Proyeccion, ProyeccionRamo, Alerta]),
    EstudianteModule,],
  controllers: [ProyeccionController],
  providers: [ProyeccionService, ProyeccionResolver, RamoService],
})
export class ProyeccionModule {}
