import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateAlertaDto {
    @IsInt()
    proyeccionId: number; 

    @IsString()
    @IsNotEmpty()
    descripcion: string; 
}