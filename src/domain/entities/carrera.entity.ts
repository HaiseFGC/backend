import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('carreras')
export class Carrera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  nombre: string;

  @Column()
  catalogo: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.carreras)
  usuario: Usuario;
}