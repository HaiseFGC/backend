import { Module, MiddlewareConsumer } from '@nestjs/common';
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
            .forRoutes('*'); // Aplica el middleware a todas las rutas bajo /estudiante
    }
}