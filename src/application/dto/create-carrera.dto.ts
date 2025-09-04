import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCarreraDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsString()
    @IsNotEmpty()
    catalogo: string;
    
}