import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProyeccionRamoDto } from './create-proyeccion-ramo.dto';

export class CreateProyeccionDto {
    @IsString()
    @IsNotEmpty()
    rut: string; //Rut del estudiante al que pertenece la proyeccion

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProyeccionRamoDto)
    ramos: CreateProyeccionRamoDto[];
}