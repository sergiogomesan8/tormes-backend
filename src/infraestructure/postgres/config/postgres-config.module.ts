import { Module } from '@nestjs/common';
import { PostgreConfigService } from './postgres-config.service';

@Module({
  providers: [PostgreConfigService],
})
export class PostgresConfigModule {}
