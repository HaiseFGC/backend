import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProyeccionRamo } from './proyeccion-ramo.entity';
import { Alerta } from './alerta.entity';

@ObjectType()
@Entity('proyecciones')
export class Proyeccion {
    @Field(() => Int)
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

    @Field(() => [ProyeccionRamo])
    @OneToMany(() => ProyeccionRamo, (proyeccionRamo) => proyeccionRamo.proyeccion, { cascade: true })
    ramos: ProyeccionRamo[];

    
    @Field(() => [Alerta], { nullable: true })
    @OneToMany(() => Alerta, (alerta) => alerta.proyeccion, { cascade: true })
    alertas: Alerta[];
    
}