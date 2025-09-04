import { DataSource, Repository } from "typeorm";
import { Carrera } from "../entities/carrera.entity";

export class CarreraRepository extends Repository<Carrera> {
    constructor(private dataSource: DataSource) {
        super(Carrera, dataSource.createEntityManager());
    }

    async createCarrera(codigo: string, nombre: string, catalogo: string): Promise<Carrera> {
        const carrera = this.create({ codigo, nombre, catalogo });
        return this.save(carrera);
    }

    async findByCodigo(codigo: string): Promise<Carrera | null> {
        return this.findOne({ where: { codigo } });
    }

    async findByNombre(nombre: string): Promise<Carrera | null> {
        return this.findOne({ where: { nombre } });
    }

    async findAll(): Promise<Carrera[]> {
        return this.find();
    }
}
    