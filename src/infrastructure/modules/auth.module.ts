import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/application/services/auth.service';
import { AuthController } from 'src/infrastructure/controllers/auth.controller';


@Module({
    imports: [
        HttpModule,
        JwtModule.register({
            global: true,
            secret: 'secretKey', // Cambia esto por una clave más segura en producción
            signOptions: { expiresIn: '1h' }, // Token válido por 1 hora
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],

})
export class AuthModule {}