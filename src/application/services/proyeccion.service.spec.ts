import { Test, TestingModule } from '@nestjs/testing';
import { ProyeccionService } from './proyeccion.service';
import { EstudianteService } from './estudiante.service';
import { RamoService } from './ramo.service';
import { ProyeccionRepository } from '../../domain/repositories/proyeccion.repository';
import { AlertaRepository } from '../../domain/repositories/alerta.repository';
import { NotFoundException } from '@nestjs/common';

// MOCKS
const mockProyeccionRepo = {
  createProyeccion: jest.fn(),
  findByRut: jest.fn(),
  findById: jest.fn(),
  deleteById: jest.fn(),
};

const mockAlertaRepo = {
  createAlerta: jest.fn(),
};

const mockEstudianteService = {
  getAvance: jest.fn(),
};

const mockRamoService = {
  obtenerMalla: jest.fn(),
};

describe('ProyeccionService', () => {
  let service: ProyeccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyeccionService,
        // Inyectamos los mocks. Como el servicio ahora usa inyección,
        // tomará estos objetos falsos en lugar de intentar crear los reales.
        { provide: ProyeccionRepository, useValue: mockProyeccionRepo },
        { provide: AlertaRepository, useValue: mockAlertaRepo },
        { provide: EstudianteService, useValue: mockEstudianteService },
        { provide: RamoService, useValue: mockRamoService },
      ],
    }).compile();

    service = module.get<ProyeccionService>(ProyeccionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('simularProyeccionAutomatica', () => {
    it('debe generar una proyección correctamente cuando hay datos', async () => {
      const rut = '12345678-9';
      const codigoCarrera = 'ICCI';
      const catalogo = '2018';

      const mockMalla = [
        { codigo: 'MAT001', asignatura: 'Calculo I', creditos: 5, nivel: 1, prereq: '' },
        { codigo: 'PROG001', asignatura: 'Programación', creditos: 5, nivel: 1, prereq: '' },
      ];
      
      mockRamoService.obtenerMalla.mockResolvedValue(mockMalla);
      mockEstudianteService.getAvance.mockResolvedValue([]);

      const resultado = await service.simularProyeccionAutomatica(rut, codigoCarrera, catalogo);

      expect(resultado).toBeDefined();
      expect(resultado.semestres.length).toBeGreaterThan(0);
      expect(mockRamoService.obtenerMalla).toHaveBeenCalledWith(codigoCarrera, catalogo);
    });

    it('debe lanzar NotFoundException si no se encuentra la malla', async () => {
      mockRamoService.obtenerMalla.mockResolvedValue(null);
      mockEstudianteService.getAvance.mockResolvedValue([]);

      await expect(
        service.simularProyeccionAutomatica('111', 'BAD_CODE', '2020')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('generarYGuardarProyeccionAutomatica', () => {
    it('debe simular y luego guardar en base de datos', async () => {
      const rut = '1111-1';
      
      mockRamoService.obtenerMalla.mockResolvedValue([
        { codigo: 'A', asignatura: 'Ramo A', creditos: 5, nivel: 1, prereq: '' }
      ]);
      mockEstudianteService.getAvance.mockResolvedValue([]);
      
      const expectedSavedEntity = { id: 1, nombre: 'Proyección Auto...' };
      mockProyeccionRepo.createProyeccion.mockResolvedValue(expectedSavedEntity);

      const result = await service.generarYGuardarProyeccionAutomatica(rut, 'ICCI', '2018');

      expect(result).toEqual(expectedSavedEntity);
      expect(mockProyeccionRepo.createProyeccion).toHaveBeenCalled();
    });
  });
});