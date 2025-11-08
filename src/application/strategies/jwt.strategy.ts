// src/application/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Le dice a Passport que busque el JWT en el header 'Authorization' como un 'Bearer' token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Le dice que ignore si el token ha expirado (puedes cambiarlo a false si lo manejas de otra forma).
      ignoreExpiration: false,
      // 3. La clave secreta para verificar la firma del token. ¡DEBE ser la misma que usaste en JwtModule!
      secretOrKey: 'secretKey', // IMPORTANTE: En producción, usa una variable de entorno.
    });
  }

  // 4. Una vez que el token se valida con éxito, Passport llama a este método.
  //    El 'payload' es el objeto que pusiste dentro del token al hacer login.
  async validate(payload: any) {
    // Lo que devuelvas aquí se adjuntará al objeto 'request' como 'request.user'.
    // Es perfecto para devolver los datos esenciales del usuario.
    return { rut: payload.rut, email: payload.email, carreras: payload.carreras };
  }
}