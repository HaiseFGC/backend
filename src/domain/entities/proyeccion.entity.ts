import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProyeccionRamo } from './proyeccion-ramo.entity';
import { Alerta } from './alerta.entity';

@Entity('proyecciones')
export class Proyeccion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rut: string; //Estudiante al que pertenece la proyeccion (Rut desde la API)

    @Column()
    nombre: string;

    @Column({ type: 'timestamp', default: () => 'now()' })
    fechaCreacion: Date;

    @OneToMany(() => ProyeccionRamo, (proyeccionRamo) => proyeccionRamo.proyeccion, { cascade: true })
    ramos: ProyeccionRamo[];

    @OneToMany(() => Alerta, (alerta) => alerta.proyeccion, { cascade: true })
    alertas: Alerta[];
    
}