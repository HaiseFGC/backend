import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EstudianteController } from '../controllers/estudiante.controller';
import { EstudianteService } from 'src/application/services/estudiante.service';

@Module({
    imports: [HttpModule],
    controllers: [EstudianteController],
    providers: [EstudianteService],
    exports: [EstudianteService],
})
export class EstudianteModule {}