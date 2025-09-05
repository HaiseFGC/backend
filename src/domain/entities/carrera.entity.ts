import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Malla } from './malla.entity';
import { Restriccion } from './restriccion.entity';

@Entity('carreras')
export class Carrera {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigo: string;
    
    @Column()
    nombre: string;

    @Column()
    catalogo: string;

    @OneToMany(() => Malla, (malla) => malla.carrera)
    mallas: Malla[];

    @OneToMany(() => Restriccion, (restriccion) => restriccion.carrera)
    restricciones: Restriccion[];

}