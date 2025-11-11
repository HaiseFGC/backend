import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InputType, Field } from '@nestjs/graphql';
import { CreateProyeccionRamoDto } from './create-proyeccion-ramo.dto';

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

    @Field()
    @IsString()
    catalogo: string;

    @Field(() => [CreateProyeccionRamoDto])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProyeccionRamoDto)
    ramos: CreateProyeccionRamoDto[];
}