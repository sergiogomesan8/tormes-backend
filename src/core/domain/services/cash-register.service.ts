import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICashRegisterService } from '../ports/inbound/cash-register.service.interface';
import {
  CreateCashRegisterDto,
  UpdateCashRegisterDto,
} from '../../../infraestructure/api-rest/dtos/cash-register.dto';
import {
  Bills,
  BillValue,
  CashRegister,
  Coins,
  CoinValue,
} from '../models/cash-register.model';
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

  async updateCashRegister(
    id: string,
    updateCashRegisterDto: UpdateCashRegisterDto,
  ): Promise<CashRegister> {
    const updatedResult = await this.cashRegisterRepository.update(
      id,
      updateCashRegisterDto,
    );
    if (updatedResult.affected === 0) {
      throw new NotFoundException('Cash Register not found');
    }

    const updatedCashRegister = await this.cashRegisterRepository.findOne({
      where: { id: id },
    });
    if (!updatedCashRegister) {
      throw new NotFoundException('Error retrieving updated cash register');
    }
    return updatedCashRegister;
  }

  async deleteCashRegister(id: string) {
    const order = await this.cashRegisterRepository.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException('Cash register not found');
    }
    await this.cashRegisterRepository.delete(id);
    return { message: `Cash register with id ${id} was deleted.` };
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
