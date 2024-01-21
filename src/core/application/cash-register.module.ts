import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashRegisterController } from '../../infraestructure/api-rest/controllers/cash-register.controller';
import { CashRegisterEntity } from '../../infraestructure/postgres/entities/cash-register.entity';
import { CashRegisterService } from '../domain/services/cash-register.service';

@Module({
  imports: [TypeOrmModule.forFeature([CashRegisterEntity])],
  controllers: [CashRegisterController],
  providers: [CashRegisterService],
})
export class CashRegisterModule {}
