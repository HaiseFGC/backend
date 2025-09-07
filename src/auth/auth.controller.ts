import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('eross/avance')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login.php')
  async login(@Query('email') email: string, @Query('password') password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('credenciales incorrectas');
    }
    return this.authService.login(email, password);
  }

  @Get('validate-user')
  async validateUser(@Query('rut') rut: string) {
    if (!rut) {
      throw new UnauthorizedException('RUT no proporcionado');
    }
    const isValid = await this.authService.validateUser(rut);
    return { valid: isValid };
  }
}