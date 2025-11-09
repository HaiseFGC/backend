import * as dotenv from 'dotenv';
dotenv.config();
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
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
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      context: ({ req }) => ({ req}),
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
      .exclude(
        {path: '/auth/login', method: RequestMethod.POST }, //Ruta de Login
        '/graphql',  //Ruta de GraphQL
      )
      .forRoutes('*');
  }
}