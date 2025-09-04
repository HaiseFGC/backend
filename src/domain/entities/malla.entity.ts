import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Carrera } from './carrera.entity';
import { Ramo } from './ramo.entity';
import { Prerrequisito } from './prerrequisito.entity';

@Entity('mallas')
export class Malla {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Carrera, (carrera) => carrera.mallas, { onDelete: 'CASCADE' })
    carrera: Carrera;

    @Column()
    codigo: string;

    @Column()
    asignatura: string;

    @Column()
    creditos: number;

    @Column()
    nivel: number;

    @OneToMany(() => Ramo, (ramo) => ramo.malla)
    ramos: Ramo[];

    @OneToMany(() => Prerrequisito, (prerrequisito) => prerrequisito.malla)
    prerrequisitos: Prerrequisito[];
    
}