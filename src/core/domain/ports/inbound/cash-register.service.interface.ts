import { CreateCashRegisterDto } from '../../../../infraestructure/api-rest/dtos/cash-register.dto';
import { CashRegister } from '../../models/cash-register.model';

export interface ICashRegisterService {
  createCashRegister(
    userId: string,
    createCashRegisterDto: CreateCashRegisterDto,
  ): Promise<CashRegister>;
}
