import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async login(
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    return this.authService.login(email, password);
  }
}