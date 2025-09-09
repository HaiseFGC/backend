import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AppController (e2e)', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('AuthController (e2e)', () => {
    it('/auth/login (GET) success', async () => {
      return request(app.getHttpServer())
        .get('/auth/login?email=juan@example.com&password=1234')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('rut');
          expect(res.body).toHaveProperty('carreras');
        });
    });

    it('/auth/login (GET) wrong credentials', async () => {
      return request(app.getHttpServer())
        .get('/auth/login?email=falso@example.com&password=wrong')
        .expect(200)
        .expect({ error: 'credenciales incorrectas' });
    });
  });

  describe('EstudiantesController (e2e)', () => {
    it('/estudiantes/malla/:codigo/:catalogo (GET)', async () => {
      return request(app.getHttpServer())
        .get('/estudiantes/malla/8606/202320')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/estudiantes/avance/:rut/:carrera (GET)', async () => {
      return request(app.getHttpServer())
        .get('/estudiantes/avance/333333333/8606')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body) || res.body.error).toBeDefined();
        });
    });
  });
});
