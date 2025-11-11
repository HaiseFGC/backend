import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Carrera } from './carrera.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  rut: string;

  @OneToMany(() => Carrera, (carrera) => carrera.usuario)
  carreras: Carrera[];
}