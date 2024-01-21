import { Test, TestingModule } from '@nestjs/testing';
import { CashRegisterService } from './cash-register.service';
import { QueryFailedError, Repository } from 'typeorm';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CashRegisterEntity } from '../../../infraestructure/postgres/entities/cash-register.entity';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { User } from '../models/user.model';
import { CashRegister } from '../models/cashRegister.model';
import { CreateCashRegisterDto } from '../../../infraestructure/api-rest/dtos/cash-register.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CashRegisterService', () => {
  let cashRegisterService: CashRegisterService;
  let cashRegisterRepository: Repository<CashRegisterEntity>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashRegisterService,
        {
          provide: getRepositoryToken(CashRegisterEntity),
          useClass: Repository,
        },
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    cashRegisterService = module.get<CashRegisterService>(CashRegisterService);
    cashRegisterRepository = module.get<Repository<CashRegisterEntity>>(
      getRepositoryToken(CashRegisterEntity),
    );
    userService = module.get<UserService>(UserService);
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

  const createCashRegisterDto = new CreateCashRegisterDto(
    coins,
    bills,
    200,
    60,
    400,
    1000,
  );

  describe('createCashRegister', () => {
    it('should create a cash regsiter for a given user and return it', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest
        .spyOn(cashRegisterRepository, 'create')
        .mockReturnValue(cashRegister);
      jest
        .spyOn(cashRegisterRepository, 'save')
        .mockResolvedValue(cashRegister);

      const result = await cashRegisterService.createCashRegister(
        'userId',
        createCashRegisterDto,
      );

      expect(result).toBe(cashRegister);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const userId = 'userId';
      jest.spyOn(userService, 'findUserById').mockImplementation(() => {
        throw new NotFoundException('User Not Found');
      });

      await expect(
        cashRegisterService.createCashRegister(userId, createCashRegisterDto),
      ).rejects.toThrow(new NotFoundException('User Not Found'));
    });

    it('should throw a ConflictException if the database query fails', async () => {
      const userId = 'userId';
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest
        .spyOn(cashRegisterRepository, 'create')
        .mockReturnValue(cashRegister);
      const errorMessage = 'query error';
      jest.spyOn(cashRegisterRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('query', [], new Error(errorMessage));
      });
      await expect(
        cashRegisterService.createCashRegister(userId, createCashRegisterDto),
      ).rejects.toThrow(new ConflictException(errorMessage));
    });

    it('should throw an error if save fails', async () => {
      const userId = 'userId';
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest
        .spyOn(cashRegisterRepository, 'create')
        .mockReturnValue(cashRegister);
      jest.spyOn(cashRegisterRepository, 'save').mockImplementation(() => {
        throw new Error('Save error');
      });

      try {
        await cashRegisterService.createCashRegister(
          userId,
          createCashRegisterDto,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Save error');
      }
    });
  });
});
