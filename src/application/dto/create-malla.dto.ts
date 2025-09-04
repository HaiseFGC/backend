import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMallaDto {
    @IsNotEmpty()
    @IsNumber()
    carreraId: number;

    @IsNotEmpty()
    @IsString()
    codigo: string;

    @IsNotEmpty()
    @IsString()
    asignatura: string;

    @IsNotEmpty()
    @IsNumber()
    creditos: number;

    @IsNotEmpty()
    @IsNumber()
    nivel: number;




}