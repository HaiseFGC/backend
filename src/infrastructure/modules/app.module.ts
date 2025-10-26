import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { EstudianteModule } from './estudiante.module';
import { JwtAuthMiddleware } from 'src/infrastructure/middleware/jwt-auth.middleware';
import { CursosModule } from './cursos.module';

@Module({
    imports: [
        //ConfigModule se agrega primero para cargar las variables de entorno globalmente
        ConfigModule.forRoot({
            isGlobal: true, 
        }),
        AuthModule, 
        EstudianteModule,
        CursosModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtAuthMiddleware)
            .exclude(
                // Excluye la ruta de login
                { path: '/auth/login', method: RequestMethod.POST }, 
                // Excluye también las rutas de inscripción si no requieren el JWT (opcional, ajusta según tu lógica de seguridad)
                // { path: '/cursos/inscribir', method: RequestMethod.POST }, 
            )
            .forRoutes('*'); // Aplica el middleware a todas las rutas restantes
    }
}
