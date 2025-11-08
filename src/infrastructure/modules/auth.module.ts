// src/infrastructure/modules/auth.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/application/services/auth.service';
import { AuthController } from 'src/infrastructure/controllers/auth.controller';

// --- NUEVOS IMPORTS ---
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/application/strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt-auth.guard';

@Module({
  imports: [
    HttpModule,
    // 1. AÑADE PassportModule
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // 2. AÑADE la estrategia y el guard como providers
    JwtStrategy,
    JwtAuthGuard,
  ],
  // 3. EXPORTA el guard para que otros módulos puedan usarlo
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}