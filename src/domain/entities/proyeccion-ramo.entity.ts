import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Proyeccion } from './proyeccion.entity';

@Entity('proyeccion_ramos')
export class ProyeccionRamo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigoRamo: string; //Código de la malla oficial

    @Column()
    semestre: number 

    @ManyToOne(() => Proyeccion, (proyeccion) => proyeccion.ramos, {
        onDelete: 'CASCADE',
    })
    proyeccion: Proyeccion;

}

