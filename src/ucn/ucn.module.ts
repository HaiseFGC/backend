import { Module } from '@nestjs/common';
import { UcnService } from './ucn.service';
import { UcnController } from './ucn.controller';

@Module({
  providers: [UcnService],
  controllers: [UcnController]
})
export class UcnModule {}
