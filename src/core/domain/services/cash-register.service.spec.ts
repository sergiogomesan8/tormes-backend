import { Test, TestingModule } from '@nestjs/testing';
import { CashRegisterService } from './cash-register.service';
import { QueryFailedError, Repository } from 'typeorm';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CashRegisterEntity } from '../../../infraestructure/postgres/entities/cash-register.entity';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { User } from '../models/user.model';
import { CashRegister } from '../models/cash-register.model';
import {
  CreateCashRegisterDto,
  UpdateCashRegisterDto,
} from '../../../infraestructure/api-rest/dtos/cash-register.dto';
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

  const updateCashRegisterDto = new UpdateCashRegisterDto(
    coins,
    bills,
    200,
    60,
    400,
    1000,
  );

  describe('findAllCashRegisters', () => {
    it('should return all cash registers', async () => {
      jest
        .spyOn(cashRegisterRepository, 'find')
        .mockResolvedValue([cashRegister]);

      const cashRegisters = await cashRegisterService.findAllCashRegisters();
      expect(cashRegisters).toEqual([cashRegister]);
      expect(cashRegisterRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no cash registers are found', async () => {
      jest.spyOn(cashRegisterRepository, 'find').mockResolvedValue([]);

      const cashRegisters = await cashRegisterService.findAllCashRegisters();
      expect(cashRegisters).toEqual([]);
      expect(cashRegisterRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(cashRegisterRepository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(cashRegisterService.findAllCashRegisters()).rejects.toThrow(
        'Database error',
      );
      expect(cashRegisterRepository.find).toHaveBeenCalled();
    });
  });

  describe('findCashRegisterById', () => {
    it('should return cash register with the id', async () => {
      jest
        .spyOn(cashRegisterRepository, 'findOne')
        .mockResolvedValue(cashRegister);

      const result = await cashRegisterService.findCashRegisterById(
        expect.any(String),
      );
      expect(result).toEqual(cashRegister);
      expect(cashRegisterRepository.findOne).toHaveBeenCalled();
    });

    it('should return NotFoundException when cash register does not exists', async () => {
      jest
        .spyOn(cashRegisterRepository, 'findOne')
        .mockResolvedValue(undefined);

      await expect(
        cashRegisterService.findCashRegisterById(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
      expect(cashRegisterRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(cashRegisterRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        cashRegisterService.findCashRegisterById(expect.any(String)),
      ).rejects.toThrow('Database error');
      expect(cashRegisterRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error when it happens', async () => {
      jest
        .spyOn(cashRegisterRepository, 'findOne')
        .mockRejectedValue(new Error());

      await expect(
        cashRegisterService.findCashRegisterById(expect.any(String)),
      ).rejects.toThrow(Error);
      expect(cashRegisterRepository.findOne).toHaveBeenCalled();
    });
  });

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

  describe('updateCashRegister', () => {
    it('should update a cash register', async () => {
      jest
        .spyOn(cashRegisterRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(cashRegisterRepository, 'findOne')
        .mockResolvedValue(cashRegister);

      const result = await cashRegisterService.updateCashRegister(
        'id',
        updateCashRegisterDto,
      );
      expect(result).toEqual(cashRegister);
      expect(cashRegisterRepository.update).toHaveBeenCalledWith(
        'id',
        updateCashRegisterDto,
      );
      expect(cashRegisterRepository.findOne).toHaveBeenCalled();
    });

    it('should throw a NotFoundException when no cash register is found to update', async () => {
      jest
        .spyOn(cashRegisterRepository, 'update')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        cashRegisterService.updateCashRegister('id', updateCashRegisterDto),
      ).rejects.toThrow(new NotFoundException('Cash Register not found'));
    });

    it('should throw a NotFoundException when the updated cash register cannot be found', async () => {
      jest
        .spyOn(cashRegisterRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(cashRegisterRepository, 'findOne')
        .mockResolvedValue(undefined);

      await expect(
        cashRegisterService.updateCashRegister('id', updateCashRegisterDto),
      ).rejects.toThrow(
        new NotFoundException('Error retrieving updated cash register'),
      );
    });

    it('should throw an error on update method when it happens', async () => {
      jest
        .spyOn(cashRegisterRepository, 'update')
        .mockRejectedValue(new Error());
      await expect(
        cashRegisterService.updateCashRegister('id', updateCashRegisterDto),
      ).rejects.toThrow(Error);
      expect(cashRegisterRepository.update).toHaveBeenCalled();
    });

    it('should throw an error on findOne method when it happens', async () => {
      jest
        .spyOn(cashRegisterRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(cashRegisterRepository, 'findOne')
        .mockRejectedValue(new Error());
      await expect(
        cashRegisterService.updateCashRegister('id', updateCashRegisterDto),
      ).rejects.toThrow(Error);
      expect(cashRegisterRepository.update).toHaveBeenCalled();
      expect(cashRegisterRepository.findOne).toHaveBeenCalled();
    });
  });
});
