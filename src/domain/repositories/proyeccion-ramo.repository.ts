import { DataSource, Repository } from 'typeorm';
import { ProyeccionRamo } from '../entities/proyeccion-ramo.entity';

export class ProyeccionRamoRepository extends Repository<ProyeccionRamo> {
    constructor(private dataSource: DataSource) {
        super(ProyeccionRamo, dataSource.createEntityManager());
    }

    async findByProyeccionId(proyeccionId: number): Promise<ProyeccionRamo[]> {
        return this.find({
            where: { proyeccion: { id: proyeccionId } },
        });
    }

    async deleteByProyeccionId(proyeccionId: number): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(ProyeccionRamo)
            .where("proyeccionId = :proyeccionId", { proyeccionId })
            .execute();
    }

    

}