import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProyeccionRamoDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    codigoRamo: string; 

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    nombreAsignatura?: string;
    
    @Field(() => Int)
    @IsInt()
    @Min(1)
    semestre: number; 
}