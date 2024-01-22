import { Test, TestingModule } from '@nestjs/testing';
import { CashRegisterController } from './cash-register.controller';
import { CashRegisterService } from '../../../core/domain/services/cash-register.service';
import { User } from '../../../core/domain/models/user.model';
import {
  CashRegister,
  SeralizedCashRegister,
} from '../../../core/domain/models/cash-register.model';
import {
  BillsDto,
  CoinsDto,
  CreateCashRegisterDto,
  UpdateCashRegisterDto,
} from '../dtos/cash-register.dto';
import { Request } from 'express';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
            findAllCashRegisters: jest.fn(),
            findCashRegisterById: jest.fn(),
            createCashRegister: jest.fn(),
            updateCashRegister: jest.fn(),
            deleteCashRegister: jest.fn(),
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

  const coin = new CoinsDto(1, 2, 3, 4, 5, 6, 7, 8);
  const bill = new BillsDto(5, 10, 20, 50, 100);
  const params = {
    coins: coin,
    bills: bill,
    totalCardPayments: 200,
    totalSpent: 60,
    cashInBox: 400,
    reportedTotal: 1000,
  };
  const createCashRegisterDto = new CreateCashRegisterDto(params);

  const updateCashRegisterDto = new UpdateCashRegisterDto(params);

  describe('findAllCashRegisters', () => {
    it('should return an array of cash registers', async () => {
      jest
        .spyOn(cashRegisterService, 'findAllCashRegisters')
        .mockResolvedValue([cashRegister]);
      expect(await cashRegisterController.findAllCashRegisters()).toEqual([
        expectedResponse,
      ]);
      expect(cashRegisterService.findAllCashRegisters).toHaveBeenCalled();
    });

    it('should return an empty array if no cash registers are found', async () => {
      jest
        .spyOn(cashRegisterService, 'findAllCashRegisters')
        .mockResolvedValue([]);
      expect(await cashRegisterController.findAllCashRegisters()).toEqual([]);
      expect(cashRegisterService.findAllCashRegisters).toHaveBeenCalled();
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(cashRegisterService, 'findAllCashRegisters')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        cashRegisterController.findAllCashRegisters(),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findCashRegisterById', () => {
    it('should return a cash register by id', async () => {
      jest
        .spyOn(cashRegisterService, 'findCashRegisterById')
        .mockResolvedValue(cashRegister);
      expect(
        await cashRegisterController.findCashRegisterById(expect.any(String)),
      ).toEqual(expectedResponse);
      expect(cashRegisterService.findCashRegisterById).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should return a NotFoundException if cash register was not found', () => {
      jest
        .spyOn(cashRegisterService, 'findCashRegisterById')
        .mockRejectedValue(new NotFoundException());

      return expect(
        cashRegisterController.findCashRegisterById(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(cashRegisterService, 'findCashRegisterById')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        cashRegisterController.findCashRegisterById(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

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

  describe('updateCashRegister', () => {
    it('should update a cash register', async () => {
      jest
        .spyOn(cashRegisterService, 'updateCashRegister')
        .mockResolvedValue(cashRegister);

      expect(
        await cashRegisterController.updateCashRegister(
          expect.any(String),
          updateCashRegisterDto,
        ),
      ).toEqual(cashRegister);
      expect(cashRegisterService.updateCashRegister).toHaveBeenCalledWith(
        expect.any(String),
        updateCashRegisterDto,
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(cashRegisterService, 'updateCashRegister')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        cashRegisterController.updateCashRegister(
          expect.any(String),
          updateCashRegisterDto,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteCashRegister', () => {
    it('should delete a cash register', async () => {
      jest
        .spyOn(cashRegisterService, 'findCashRegisterById')
        .mockResolvedValue(cashRegister);
      jest.spyOn(cashRegisterService, 'deleteCashRegister').mockResolvedValue({
        message: `Cash register with id ${expect.any(String)} was deleted.`,
      });

      expect(
        await cashRegisterController.deleteCashRegister(expect.any(String)),
      ).toEqual({
        message: `Cash register with id ${expect.any(String)} was deleted.`,
      });
      expect(cashRegisterService.deleteCashRegister).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(cashRegisterService, 'findCashRegisterById')
        .mockResolvedValue(cashRegister);
      jest
        .spyOn(cashRegisterService, 'deleteCashRegister')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        cashRegisterController.deleteCashRegister(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
