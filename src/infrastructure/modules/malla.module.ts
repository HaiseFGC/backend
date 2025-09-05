import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Malla } from 'src/domain/entities/malla.entity';
import { MallaRepository } from 'src/domain/repositories/malla.repository';
import { MallaService } from 'src/application/services/malla.service';
import { MallaController } from '../controllers/malla.controller';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Malla])],
  controllers: [MallaController],
  providers: [
    MallaService,
    {
      provide: MallaRepository,
      useFactory: (dataSource: DataSource) => new MallaRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [MallaService],
})
export class MallaModule {}
