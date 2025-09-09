import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EstudianteController } from 'src/infrastructure/controllers/estudiante.controller';
import { EstudianteService } from 'src/application/services/estudiante.service';

@Module({
    imports: [HttpModule],
    controllers: [EstudianteController],
    providers: [EstudianteService],
})
export class EstudianteModule {}