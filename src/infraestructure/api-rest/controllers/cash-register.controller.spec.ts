import { Test, TestingModule } from '@nestjs/testing';
import { CashRegisterController } from './cash-register.controller';
import { CashRegisterService } from '../../../core/domain/services/cash-register.service';
import { User } from '../../../core/domain/models/user.model';
import {
  CashRegister,
  SeralizedCashRegister,
} from '../../../core/domain/models/cashRegister.model';
import { CreateCashRegisterDto } from '../dtos/cash-register.dto';
import { Request } from 'express';
import { InternalServerErrorException } from '@nestjs/common';

describe('CashRegisterController', () => {
  let cashRegisterController: CashRegisterController;
  let cashRegisterService: CashRegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashRegisterController],
      providers: [
        {
          provide: CashRegisterService,
          useValue: {
            createCashRegister: jest.fn(),
          },
        },
      ],
    }).compile();

    cashRegisterController = module.get<CashRegisterController>(
      CashRegisterController,
    );
    cashRegisterService = module.get<CashRegisterService>(CashRegisterService);
  });

  const user = {
    id: 'userId',
    name: 'Test User',
    email: 'user@example.com',
  } as User;

  const coins = {
    oneCent: 1,
    twoCent: 2,
    fiveCent: 3,
    tenCent: 4,
    twentyCent: 5,
    fiftyCent: 6,
    oneEuro: 7,
    twoEuro: 8,
  };

  const bills = {
    fiveEuro: 5,
    tenEuro: 10,
    twentyEuro: 20,
    fiftyEuro: 50,
    hundredEuro: 100,
  };

  const cashRegister = {
    id: 'c-id',
    date: 0,
    coins: coins,
    bills: bills,
    totalCardPayments: 200,
    totalSpent: 60,
    cashInBox: 400,
    reportedTotal: 1000,
    employee: user,
  } as CashRegister;

  const expectedResponse = new SeralizedCashRegister(cashRegister);

  const createCashRegisterDto = new CreateCashRegisterDto(
    coins,
    bills,
    200,
    60,
    400,
    1000,
  );

  describe('createCashRegister', () => {
    it('should create a cash register', async () => {
      const req: Partial<Request> = { user: user };
      jest
        .spyOn(cashRegisterService, 'createCashRegister')
        .mockResolvedValue(cashRegister);

      expect(
        await cashRegisterController.createCashRegister(
          req as Request,
          createCashRegisterDto,
        ),
      ).toEqual(expectedResponse);
      expect(cashRegisterService.createCashRegister).toHaveBeenCalledWith(
        'userId',
        createCashRegisterDto,
      );
    });

    it('should return an Http Exception error when it happens', () => {
      const req: Partial<Request> = { user: user };
      jest
        .spyOn(cashRegisterService, 'createCashRegister')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        cashRegisterController.createCashRegister(
          req as Request,
          createCashRegisterDto,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
