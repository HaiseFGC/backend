import { Module } from '@nestjs/common';
import { EstudianteController } from 'src/infrastructure/controllers/estudiante.controller';
import { EstudianteService } from 'src/application/services/estudiante.service';

@Module({
    controllers: [EstudianteController],
    providers: [EstudianteService],
})
export class EstudianteModule {}