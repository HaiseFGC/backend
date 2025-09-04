import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Avance } from "./avance.entity";
import { Proyeccion } from "./proyeccion.entity";

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ unique: true })
    rut: string;

    @Column({ type: 'text'})
    tipo: 'ESTUDIANTE' | 'ADMINISTRADOR';

    @OneToMany(() => Avance, (avance) => avance.usuario)
    avances: Avance[];

    @OneToMany(() => Proyeccion, (proyeccion) => proyeccion.usuario)
    proyecciones: Proyeccion[];
}