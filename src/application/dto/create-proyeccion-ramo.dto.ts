import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProyeccionRamoDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    codigoRamo: string; 

    @Field(() => Int)
    @IsInt()
    @Min(1)
    semestre: number; 
}