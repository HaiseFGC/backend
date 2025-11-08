// src/domain/entities/proyeccion.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProyeccionRamo } from './proyeccion-ramo.entity';
import { Alerta } from './alerta.entity';

@ObjectType() // 2. Declara como tipo de GraphQL
@Entity('proyecciones')
export class Proyeccion {
    @Field(() => Int) // 3. Expone los campos
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    rut: string;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    codigoCarrera: string;

    @Field()
    @Column({ type: 'timestamp', default: () => 'now()' })
    fechaCreacion: Date;

    @Field(() => [ProyeccionRamo]) // Expone la relación como un array de ProyeccionRamo
    @OneToMany(() => ProyeccionRamo, (proyeccionRamo) => proyeccionRamo.proyeccion, { cascade: true })
    ramos: ProyeccionRamo[];

    // Por ahora no expondremos las alertas, puedes hacerlo después si lo necesitas.
    @OneToMany(() => Alerta, (alerta) => alerta.proyeccion, { cascade: true })
    alertas: Alerta[];
}