import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashRegisterController } from '../../infraestructure/api-rest/controllers/cash-register.controller';
import { CashRegisterEntity } from '../../infraestructure/postgres/entities/cash-register.entity';
import { CashRegisterService } from '../domain/services/cash-register.service';
import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CashRegisterEntity]), UserModule],
  controllers: [CashRegisterController],
  providers: [CashRegisterService],
})
export class CashRegisterModule {}
