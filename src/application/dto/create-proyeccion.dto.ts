import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InputType, Field } from '@nestjs/graphql';
import { CreateProyeccionRamoDto } from './create-proyeccion-ramo.dto';

@InputType()
export class PeriodoProyeccionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  catalogo: string;

  @Field(() => [CreateProyeccionRamoDto])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProyeccionRamoDto)
  ramos: CreateProyeccionRamoDto[];
}

@InputType()
export class CreateProyeccionDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  rut: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field()
  @IsString()
  codigoCarrera: string;

  // 🔹 Cambiamos "catalogo" y "ramos" por un arreglo de periodos
  @Field(() => [PeriodoProyeccionInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeriodoProyeccionInput)
  periodos: PeriodoProyeccionInput[];
}
