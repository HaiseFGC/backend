import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpService) {}

  async login(email: string, password: string) {
    const url = `https://puclaro.ucn.cl/eross/avance/login.php?email=${email}&password=${password}`;
    try {
      const response = await firstValueFrom(this.http.get(url));
      return response.data;
    } catch (error) {
      return { error: 'Error en login' };
    }
  }
}
