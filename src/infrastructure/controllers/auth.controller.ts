import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/application/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login') // Endpoint para login "http://localhost:3000/auth/login"
    async login(
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        return this.authService.login(email, password);
    }
}