import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApiUcnConfig } from "src/infrastructure/config/apiucn.config";
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
    constructor(
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService
    ) {}

    async login(email: string, password: string) {
        const url = `${ApiUcnConfig}/login.php?email=${email}&password=${password}`;

        try {
            const response = await firstValueFrom(this.httpService.get(url));
            const data = response.data;

            if (data.error) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const payload = { rut: data.rut};
            const token = jwt.sign(payload, 'secretKey', { expiresIn: '1h' }); // Despues pasar a un env variable

            return { access_token: token };
        } catch (error) {
            throw new UnauthorizedException('Error during authentication');
        }
    }

}