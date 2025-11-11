import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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

    @ManyToOne(() => Proyeccion, (proyeccion) => proyeccion.alertas, {
        onDelete: 'CASCADE',
    })
    proyeccion: Proyeccion;
}