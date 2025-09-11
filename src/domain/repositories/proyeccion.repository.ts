import { DataSource, Repository } from 'typeorm';
import { Proyeccion } from '../entities/proyeccion.entity';
import { CreateProyeccionDto } from '../../application/dto/create-proyeccion.dto';
import { ProyeccionRamo } from '../entities/proyeccion-ramo.entity';

export class ProyeccionRepository extends Repository<Proyeccion> {
    constructor(private dataSource: DataSource) {
        super(Proyeccion, dataSource.createEntityManager());
    }

    async createProyeccion(dto: CreateProyeccionDto): Promise<Proyeccion> {
        const newProyeccion = this.create({
        rut: dto.rut,
        nombre: dto.nombre,
        ramos: dto.ramos.map(r => this.dataSource.getRepository(ProyeccionRamo).create(r)),
        });
        return this.save(newProyeccion);
  }

    async findById(id: number): Promise<Proyeccion | null> {
        return this.findOne({
            where: { id },
            relations: ['ramos', 'alertas'],
        })
    }
    
    async findByRut(rut: string): Promise<Proyeccion[]> {
        return this.find({
            where: { rut },
            relations: ['ramos', 'alertas'],
        });
    }

    async deleteById(id: number): Promise<void> {
        await this.delete(id);
    }
}
