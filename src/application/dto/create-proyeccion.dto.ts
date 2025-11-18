import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class RamoPeriodoInput {
  @Field()
  codigoRamo: string;

  @Field(() => Int)
  semestre: number;
}

@InputType()
export class PeriodoProyeccionInput {
  @Field()
  catalogo: string;

  @Field(() => [RamoPeriodoInput])
  ramos: RamoPeriodoInput[];
}

@InputType()
export class CreateProyeccionDto {
  @Field()
  nombre: string;

  @Field()
  rut: string;

  @Field()
  codigoCarrera: string;

  @Field(() => [PeriodoProyeccionInput])
  periodos: PeriodoProyeccionInput[];
}
