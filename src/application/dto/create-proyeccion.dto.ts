import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class RamoPeriodoInput {
  @Field()
  @IsString()
  codigoRamo: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nombreAsignatura?: string;

  @Field(() => Int)
  @IsNumber()
  semestre: number;
}

@InputType()
export class PeriodoProyeccionInput {
  @Field()
  @IsString()
  catalogo: string;

  @Field(() => [RamoPeriodoInput])
  @IsArray()
  @ValidateNested({ each: true }) 
  @Type(() => RamoPeriodoInput)  
  ramos: RamoPeriodoInput[];
}

@InputType()
export class CreateProyeccionDto {
  @Field()
  @IsString()
  nombre: string;

  @Field()
  @IsString()
  rut: string;

  @Field()
  @IsString() 
  codigoCarrera: string;

  @Field(() => [PeriodoProyeccionInput])
  @IsArray()
  @ValidateNested({ each: true }) 
  @Type(() => PeriodoProyeccionInput) 
  periodos: PeriodoProyeccionInput[];
}