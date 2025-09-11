import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateAlertaDto {
    @IsInt()
    proyeccionId: number; //ID de la proyección a la que pertenece la alerta

    @IsString()
    @IsNotEmpty()
    descripcion: string; //Descripción de la alerta
}