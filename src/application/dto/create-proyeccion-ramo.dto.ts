import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProyeccionRamoDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    codigoRamo: string; //Código de la malla oficial

    @Field(() => Int)
    @IsInt()
    @Min(1)
    semestre: number; //Semestre en el que se proyecta cursar el ramo
}