import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { ProyeccionRamo } from 'src/domain/entities/proyeccion-ramo.entity';
import { Alerta } from 'src/domain/entities/alerta.entity';
import { ProyeccionService } from 'src/application/services/proyeccion.service';
import { ProyeccionController } from '../controllers/proyeccion.controller';
import { ProyeccionResolver } from '../graphql/resolvers/proyeccion.resolver';


@Module({
  imports: [TypeOrmModule.forFeature([Proyeccion, ProyeccionRamo, Alerta])],
  controllers: [ProyeccionController],
  providers: [ProyeccionService, ProyeccionResolver],
})
export class ProyeccionModule {}
