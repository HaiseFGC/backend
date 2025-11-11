import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly apiUcnUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.apiUcnUrl =
      this.configService.get<string>('API_UCN_URL') ??
      'https://puclaro.ucn.cl/eross/avance/';
  }

  async login(email: string, password: string) {
    const encodedEmail = encodeURIComponent(email);
    const encodedPassword = encodeURIComponent(password);
    const url = `${this.apiUcnUrl}login.php?email=${encodedEmail}&password=${encodedPassword}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { validateStatus: () => true }),
      );

      const { data, status } = response;

      
      if (status !== 200 || !data?.rut) {
        this.logger.warn('Invalid credentials or missing RUT', {
          status,
          data,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`Usuario autenticado: ${data.rut}`);

     
      const payload = { rut: data.rut };

      
      const token = await this.jwtService.signAsync(payload);

      return {
        rut: data.rut,
        carreras: data.carreras ?? [],
        access_token: token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      this.logger.error(
        'Error durante la autenticación',
        error?.stack ?? error,
      );
      throw new InternalServerErrorException('Error during authentication');
    }
  }
}
