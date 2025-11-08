// src/domain/entities/proyeccion-ramo.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Proyeccion } from './proyeccion.entity';

@ObjectType() // 2. Indica que esta clase es un tipo de GraphQL
@Entity('proyeccion_ramos')
export class ProyeccionRamo {
    @Field(() => Int) // 3. Expone el campo a GraphQL
    @PrimaryGeneratedColumn()
    id: number;

    @Field() // Expone el campo (string por defecto)
    @Column()
    codigoRamo: string;

    @Field(() => Int) // Expone el campo como un entero
    @Column()
    semestre: number 

    // No exponemos la relación 'proyeccion' directamente aquí para evitar referencias circulares.
    // Lo haremos desde la entidad Proyeccion.
    @ManyToOne(() => Proyeccion, (proyeccion) => proyeccion.ramos, {
        onDelete: 'CASCADE',
    })
    proyeccion: Proyeccion;
}