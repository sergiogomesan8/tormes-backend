import { CreateCashRegisterDto } from '../../../../infraestructure/api-rest/dtos/cash-register.dto';
import { CashRegister } from '../../models/cashRegister.model';

export interface ICashRegisterService {
  createCashRegister(
    createCashRegisterDto: CreateCashRegisterDto,
  ): Promise<CashRegister>;
}
