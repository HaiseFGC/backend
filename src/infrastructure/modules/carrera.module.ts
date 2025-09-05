import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrera } from 'src/domain/entities/carrera.entity';
import { CarreraRepository } from 'src/domain/repositories/carrera.repository';
import { CarreraService } from 'src/application/services/carrera.service';
import { CarreraController } from '../controllers/carrera.controller';
import { DataSource } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Carrera])],
    controllers: [CarreraController],
    providers: [
        CarreraService,
        {
            provide: CarreraRepository,
            useFactory: (dataSource: DataSource) => new CarreraRepository(dataSource),
            inject: [DataSource],
        },
    ],
    exports: [CarreraService],
})
export class CarreraModule {}