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
  periodo: string; 

  @Field(() => Int)
  semestreRelativo: number;

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