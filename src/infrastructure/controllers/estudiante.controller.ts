import { Controller, Post, Body } from '@nestjs/common';
import { EstudianteService } from 'src/application/services/estudiante.service';

@Controller('estudiante')
export class EstudianteController {
    constructor(private readonly estudianteService: EstudianteService) {}

    @Post('login') // Eliminarlogin de logica de estudiante, ya existe en auth
    async login(
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        return this.estudianteService.login(email, password);
    }
    
}