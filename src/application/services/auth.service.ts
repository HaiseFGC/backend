import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApiUcnConfig } from "src/infrastructure/config/apiucn.config";

@Injectable()
export class AuthService {
    constructor(
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService
    ) {}

    async login(email: string, password: string) {
        const url = `${ApiUcnConfig}/login.php?email=${email}&password=${password}`;
        console.log(`Authenticating user at URL: ${url}`);

        try {
            const response = await firstValueFrom(
                this.httpService.get(url, { validateStatus: () => true })
            );
            const data = response.data;

            if (!data || !data.rut) {
                console.error('Invalid credentials or missing RUT', data);
                throw new UnauthorizedException('Invalid credentials');
            }

            console.log(`User authenticated: ${JSON.stringify(data)}`);

            // Genera token solo con el RUT, puedes incluir más campos si quieres
            const payload = { rut: data.rut };
            const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });

            return { access_token: token };
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message || error);
            throw new UnauthorizedException('Error during authentication');
        }
    }
}
