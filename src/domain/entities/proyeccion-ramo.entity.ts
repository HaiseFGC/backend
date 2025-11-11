import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Proyeccion } from './proyeccion.entity';

@ObjectType() // ✅ Exponer como tipo GraphQL
@Entity('proyeccion_ramos')
export class ProyeccionRamo {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  codigoRamo: string;

  @Field(() => Int)
  @Column()
  semestre: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  catalogo?: string; // 🔹 Permite exponer el periodo académico

  @ManyToOne(() => Proyeccion, (proyeccion) => proyeccion.ramos, {
    onDelete: 'CASCADE',
  })
  proyeccion: Proyeccion;
}
