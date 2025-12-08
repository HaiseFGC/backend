import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RamoProyectadoGraphQL {
  @Field()
  codigoRamo: string;

  @Field()
  nombreAsignatura: string;

  @Field(() => Int)
  creditos: number;
}

@ObjectType()
export class SemestreProyeccionGraphQL {
  @Field()
  periodo: string; // Ej: "202610"

  @Field(() => Int)
  semestreRelativo: number; // 1, 2, 3...

  @Field(() => Int)
  totalCreditos: number;

  @Field(() => [RamoProyectadoGraphQL])
  asignaturas: RamoProyectadoGraphQL[];
}

@ObjectType()
export class ProyeccionAutomaticaResponse {
  @Field(() => [SemestreProyeccionGraphQL])
  semestres: SemestreProyeccionGraphQL[];
}