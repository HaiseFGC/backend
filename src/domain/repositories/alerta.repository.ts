import { DataSource, Repository } from 'typeorm';
import { Alerta } from '../entities/alerta.entity';

export class AlertaRepository extends Repository<Alerta> {
    constructor(private dataSource: DataSource) {
        super(Alerta, dataSource.createEntityManager());
    }

    async findByProyeccionId(proyeccionId: number): Promise<Alerta[]> {
        return this.find({
            where: { proyeccion: { id: proyeccionId } },
        });
    }

    async createAlerta(proyeccionId: number, descripcion: string): Promise<Alerta> {
        const newAlerta = this.create({
            descripcion,
            proyeccion: { id: proyeccionId } as any,
        });
        return this.save(newAlerta);
    }

    async deleteByProyeccionId(proyeccionId: number): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(Alerta)
            .where("proyeccionId = :proyeccionId", { proyeccionId })
            .execute();
    }
    

}