export class CreateUsuarioDto {
    email: string;
    password: string;
    rut: string;
    tipo: 'ESTUDIANTE' | 'ADMINISTRADOR';
}