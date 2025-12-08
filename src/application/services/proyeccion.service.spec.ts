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

    it('debe respetar prerrequisitos y límite de créditos (Lógica Compleja)', async () => {
      const rut = '12345678-9';
      
      // ESCENARIO COMPLEJO:
      // Ramo A: 20 créditos (Sin requisitos)
      // Ramo B: 15 créditos (Sin requisitos) -> Entre A y B suman 35 (>30 max)
      // Ramo C: 5 créditos (Requisito: A) -> No puede tomarse hasta aprobar A
      const mockMalla = [
        { codigo: 'A', asignatura: 'Ramo A', creditos: 20, nivel: 1, prereq: '' },
        { codigo: 'B', asignatura: 'Ramo B', creditos: 15, nivel: 1, prereq: '' },
        { codigo: 'C', asignatura: 'Ramo C', creditos: 5, nivel: 2, prereq: 'A' },
      ];

      mockRamoService.obtenerMalla.mockResolvedValue(mockMalla);
      mockEstudianteService.getAvance.mockResolvedValue([]); // Alumno nuevo

      const resultado = await service.simularProyeccionAutomatica(rut, 'ICCI', '2018');

      // VERIFICACIONES ESPERADAS:
      // Semestre 1: Solo cabe 'A' (20 cr). 'B' (15 cr) no cabe porque 20+15=35 > 30.
      // Semestre 2: Toma 'B' (que quedó pendiente) y 'C' (que se desbloqueó al aprobar A).
      
      expect(resultado.semestres).toHaveLength(2); // Debería tomar 2 semestres
      
      // Semestre 1
      expect(resultado.semestres[0].totalCreditos).toBe(20);
      expect(resultado.semestres[0].asignaturas[0].codigoRamo).toBe('A');

      // Semestre 2
      expect(resultado.semestres[1].asignaturas.map(r => r.codigoRamo)).toContain('B');
      expect(resultado.semestres[1].asignaturas.map(r => r.codigoRamo)).toContain('C');
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


describe('Operaciones CRUD', () => {
    
    it('findAllByRut debe retornar un array de proyecciones', async () => {
      const result = [{ id: 1, nombre: 'P1' }];
      mockProyeccionRepo.findByRut.mockResolvedValue(result);

      expect(await service.findAllByRut('123')).toEqual(result);
      expect(mockProyeccionRepo.findByRut).toHaveBeenCalledWith('123', undefined);
    });

    it('findOne debe retornar una proyección si existe', async () => {
      const result = { id: 1, nombre: 'P1' };
      mockProyeccionRepo.findById.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
    });

    it('findOne debe lanzar error si no existe', async () => {
      mockProyeccionRepo.findById.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('deleteProyeccion debe llamar al repo y retornar mensaje', async () => {
      mockProyeccionRepo.deleteById.mockResolvedValue(undefined);
      const result = await service.deleteProyeccion(1);
      
      expect(mockProyeccionRepo.deleteById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Proyección eliminada exitosamente' });
    });

    it('createProyeccion manual debe llamar al repo', async () => {
      const dto = { rut: '1-9', codigoCarrera: 'INF', nombre: 'Manual', periodos: [] };
      const saved = { id: 1, ...dto };
      mockProyeccionRepo.createProyeccion.mockResolvedValue(saved);

      expect(await service.createProyeccion(dto)).toEqual(saved);
      expect(mockProyeccionRepo.createProyeccion).toHaveBeenCalledWith(dto);
    });
  });

});