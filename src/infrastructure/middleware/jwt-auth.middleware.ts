import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
    constructor(private config: ConfigService) {}

    use(req: Request, res: Response, next: NextFunction) {

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            const jwtSecret = this.config.get('JWT_SECRET');
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined in the configuration');
            }
            const decoded = jwt.verify(token, jwtSecret);
            (req as any).user = decoded;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}