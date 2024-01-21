import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICashRegisterService } from '../ports/inbound/cash-register.service.interface';
import { CreateCashRegisterDto } from 'src/infraestructure/api-rest/dtos/cash-register.dto';
import {
  Bills,
  BillValue,
  CashRegister,
  Coins,
  CoinValue,
} from '../models/cashRegister.model';
import { InjectRepository } from '@nestjs/typeorm';
import { CashRegisterEntity } from '../../../infraestructure/postgres/entities/cash-register.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class CashRegisterService implements ICashRegisterService {
  constructor(
    @InjectRepository(CashRegisterEntity)
    private cashRegisterRepository: Repository<CashRegisterEntity>,
    private readonly userService: UserService,
  ) {}

  async findAllCashRegisters(): Promise<CashRegister[]> {
    const cashRegisters = await this.cashRegisterRepository.find();
    return cashRegisters;
  }

  async findCashRegisterById(id: string): Promise<CashRegister> {
    const cashRegister = await this.cashRegisterRepository.findOne({
      where: { id: id },
    });

    if (!cashRegister) {
      throw new NotFoundException('Cash Register Not Found');
    }
    return cashRegister;
  }

  async createCashRegister(
    userId: string,
    createCashRegisterDto: CreateCashRegisterDto,
  ): Promise<CashRegister> {
    try {
      const user = await this.userService.findUserById(userId);

      const cashRegister = this.cashRegisterRepository.create(
        createCashRegisterDto,
      );
      cashRegister.employee = user;

      cashRegister.totalCoinPayments = this.calculateTotalCoins(
        createCashRegisterDto.coins,
      );
      cashRegister.totalBillPayments = this.calculateTotalBills(
        createCashRegisterDto.bills,
      );
      cashRegister.calculatedTotal =
        this.calculateTotalCashRegister(cashRegister);

      await this.cashRegisterRepository.save(cashRegister);
      return cashRegister;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(error.message);
      } else {
        throw error;
      }
    }
  }

  private calculateTotalCoins(coins: Coins): number {
    let totalCoins = 0;
    for (const coinType in coins) {
      if (coins.hasOwnProperty(coinType)) {
        totalCoins += coins[coinType] * CoinValue[coinType];
      }
    }
    return totalCoins;
  }

  private calculateTotalBills(bills: Bills): number {
    let totalBills = 0;
    for (const billType in bills) {
      if (bills.hasOwnProperty(billType)) {
        totalBills += bills[billType] * BillValue[billType];
      }
    }
    return totalBills;
  }

  private calculateTotalCashRegister(cashRegister: CashRegister): number {
    return (
      cashRegister.totalCoinPayments +
      cashRegister.totalBillPayments +
      cashRegister.totalCardPayments -
      cashRegister.totalSpent -
      cashRegister.cashInBox
    );
  }
}
