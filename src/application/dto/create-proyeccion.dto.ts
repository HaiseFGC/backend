import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class RamoPeriodoInput {
  @Field()
  codigoRamo: string;

  // --- NUEVO CAMPO AGREGADO ---
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nombreAsignatura?: string;
  // ----------------------------

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