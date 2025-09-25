import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { EstudianteModule } from './estudiante.module';
import { JwtAuthMiddleware } from 'src/infrastructure/middleware/jwt-auth.middleware';

@Module({
    imports: [AuthModule, EstudianteModule],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtAuthMiddleware)
            .exclude(
                { path: '/auth/login', method: RequestMethod.POST }, // Excluye la ruta de login del middleware
            )
            .forRoutes('*'); // Aplica el middleware a todas las rutas bajo /estudiante
    }
}