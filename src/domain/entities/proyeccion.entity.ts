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

  // 🔹 Getter computado que agrupa los ramos por catálogo
  @Field(() => [PeriodoProyeccionGraphQL], { nullable: true })
  get periodos(): PeriodoProyeccionGraphQL[] {
    if (!this.ramos || this.ramos.length === 0) return [];

    const agrupado = new Map<string, { catalogo: string; ramos: RamoPeriodoGraphQL[] }>();

    for (const ramo of this.ramos) {
      const catalogo = ramo.catalogo ?? 'desconocido'; // ✅ Valor por defecto seguro

      if (!agrupado.has(catalogo)) {
        agrupado.set(catalogo, {
          catalogo,
          ramos: [],
        });
      }

      agrupado.get(catalogo)!.ramos.push({
        codigoRamo: ramo.codigoRamo,
        semestre: ramo.semestre,
      });
    }

    return Array.from(agrupado.values());
  }
}

@ObjectType()
export class PeriodoProyeccionGraphQL {
  @Field()
  catalogo: string;

  @Field(() => [RamoPeriodoGraphQL])
  ramos: RamoPeriodoGraphQL[];
}

@ObjectType()
export class RamoPeriodoGraphQL {
  @Field()
  codigoRamo: string;

  @Field(() => Int)
  semestre: number;
}
