import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Proyeccion } from "./proyeccion.entity";

@ObjectType()
@Entity('alertas')
export class Alerta {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    descripcion: string;

    // --- NUEVO CAMPO AGREGADO ---
    @Field()
    @CreateDateColumn() // La BD asignará la fecha actual automáticamente al crear
    fecha: Date;
    // ----------------------------

    @ManyToOne(() => Proyeccion, (proyeccion) => proyeccion.alertas, {
        onDelete: 'CASCADE',
    })
    proyeccion: Proyeccion;
}