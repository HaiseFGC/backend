import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { ProyeccionRamo } from 'src/domain/entities/proyeccion-ramo.entity';
import { Alerta } from 'src/domain/entities/alerta.entity';
import { ProyeccionService } from 'src/application/services/proyeccion.service';
import { ProyeccionController } from '../controllers/proyeccion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Proyeccion, ProyeccionRamo, Alerta])],
  controllers: [ProyeccionController],
  providers: [ProyeccionService],
})
export class ProyeccionModule {}
