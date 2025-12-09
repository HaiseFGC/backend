import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Proyeccion } from './proyeccion.entity';

@ObjectType()
@Entity('proyeccion_ramos')
export class ProyeccionRamo {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  codigoRamo: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nombreAsignatura: string;

  @Field(() => Int)
  @Column()
  semestre: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  catalogo?: string;

  @ManyToOne(() => Proyeccion, (proyeccion) => proyeccion.ramos, {
    onDelete: 'CASCADE',
  })
  proyeccion: Proyeccion;
}