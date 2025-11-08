import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { EstudianteModule } from './estudiante.module';
import { ProyeccionModule } from './proyeccion.module';
import { JwtAuthMiddleware } from 'src/infrastructure/middleware/jwt-auth.middleware';
import { Usuario } from 'src/domain/entities/usuario.entity';
import { Carrera } from 'src/domain/entities/carrera.entity';
import { Proyeccion } from 'src/domain/entities/proyeccion.entity';
import { ProyeccionRamo } from 'src/domain/entities/proyeccion-ramo.entity';
import { Alerta } from 'src/domain/entities/alerta.entity';
import { env } from 'process';
// GraphQLModule
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';


@Module({
  imports: [
    // Configuración GraphQLModule
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Generará un archivo con el esquema
      sortSchema: true, // Ordena el esquema alfabéticamente
      playground: true, // Habilita el playground de GraphQL en /graphql
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST || 'localhost',
      port: Number(env.DB_PORT) || 5432,
      username: env.DB_USERNAME || 'postgres',
      password: env.DB_PASSWORD || 'postgres',
      database: env.DB_NAME || 'ucn_database',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Usuario, Carrera, Proyeccion, ProyeccionRamo, Alerta],
    }),
    AuthModule,
    EstudianteModule,
    ProyeccionModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude({ path: '/auth/login', method: RequestMethod.POST },
        // Añadimos una nueva exclusión para la carga inicial del Playground
        { path: '/graphql', method: RequestMethod.GET } 
      )
      .forRoutes('*');
  }
}
