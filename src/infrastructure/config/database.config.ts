import { DataSource } from 'typeorm';
import { Usuario } from 'src/domain/entities/usuario.entity';
import { Carrera } from 'src/domain/entities/carrera.entity';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { ProyeccionRamo } from 'src/domain/entities/proyeccion-ramo.entity';
import { Alerta } from 'src/domain/entities/alerta.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'minombre2',
  database: 'ucn_db',
  synchronize: true, // solo para desarrollo
  entities: [Usuario, Carrera, Proyeccion, ProyeccionRamo, Alerta],
});
