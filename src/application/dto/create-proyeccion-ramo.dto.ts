import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateProyeccionRamoDto {
    @IsString()
    @IsNotEmpty()
    codigoRamo: string; //Código de la malla oficial

    @IsInt()
    @Min(1)
    semestre: number; //Semestre en el que se proyecta cursar el ramo
}