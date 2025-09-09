import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(), // aquí mockeamos get()
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('login success', async () => {
    const mockResponse = {
      data: {
        rut: '11188222333',
        carreras: [{ codigo: '8606', nombre: 'ICCI', catalogo: '201610' }],
      },
    };

    // El get del HttpService retorna un Observable
    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.login('ximena@example.com', 'qwerty');
    expect(result).toEqual(mockResponse.data);
  });

  it('login fail', async () => {
    const mockResponse = { data: { error: 'credenciales incorrectas' } };
    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.login('falso@example.com', 'wrong');
    expect(result).toEqual(mockResponse.data);
  });
});
