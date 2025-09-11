import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Proyeccion } from "./proyeccion.entity";

@Entity('alertas')
export class Alerta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descripcion: string; //Descripción de la alerta

    @ManyToOne(() => Proyeccion, (proyeccion) => proyeccion.alertas, {
        onDelete: 'CASCADE',
    })
    proyeccion: Proyeccion;
}