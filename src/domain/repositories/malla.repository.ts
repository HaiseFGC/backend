import { DataSource, Repository } from 'typeorm';
import { Malla } from '../entities/malla.entity';

export class MallaRepository extends Repository<Malla> {
    constructor(private dataSource: DataSource) {
        super(Malla, dataSource.createEntityManager());
    }

    async createMalla(
        carreraId: number,
        codigo: string,
        asignatura: string,
        creditos: number,
        nivel: number,
    ): Promise<Malla> {
        const carrera = await this.dataSource.getRepository('Carrera').findOneBy({ id: carreraId });

        if (!carrera) {
            throw new Error('Carrera not found');
        }
        const malla = this.create({ carrera, codigo, asignatura, creditos, nivel });
        return this.save(malla);
    }

    async findByCodigo(codigo: string): Promise<Malla | null> {
        return this.findOne({ where: { codigo }, relations: ['carrera', 'ramos', 'prerrequisitos'] });
    }

    async findAll(): Promise<Malla[]> {
        return this.find({ relations: ['carrera', 'ramos', 'prerrequisitos'] });
    }

    async findByCarreraId(carreraId: number): Promise<Malla[]> {
        return this.find({ where: { carrera: { id: carreraId } }, relations: ['carrera', 'ramos', 'prerrequisitos'] });
    }

    
}