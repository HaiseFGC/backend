import { Module } from '@nestjs/common';
import { CursosService } from '../../application/services/cursos.service';
import { CursosController } from '../controllers/cursos.controller';
import { ApiUcnService } from '../../application/services/apiucn.service'; // 1. Importar el nuevo servicio

@Module({
  // 2. Registrar CursosService y ApiUcnService como proveedores
  // Esto permite que CursosService pueda inyectar ApiUcnService.
  providers: [CursosService, ApiUcnService], 
  
  controllers: [CursosController],
  
  // 3. Exportar ambos servicios para que otros módulos puedan utilizarlos (opcional pero recomendado)
  exports: [CursosService, ApiUcnService], 
})
export class CursosModule {}
