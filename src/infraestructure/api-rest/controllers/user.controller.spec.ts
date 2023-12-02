import { UserController } from './user.controller';
import { UserService } from '../../../core/domain/services/user.service';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { CreateUserDto } from '../dtos/user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    userService = { create: jest.fn() } as any;
    userController = new UserController(userService);
  });

  describe('create', () => {
    it('should return a user entity', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John',
        lastName: 'Doe',
        phoneNumber: 1234567890,
        gender: 1,
        birthdate: 1234567890,
        userType: 1,
      };
      const userEntity = new UserEntity();
      (userService.create as jest.Mock).mockResolvedValue(userEntity);

      expect(await userController.create(createUserDto)).toBeInstanceOf(
        UserEntity,
      );
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an exception when userService.create throws an error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John',
        lastName: 'Doe',
        phoneNumber: 1234567890,
        gender: 1,
        birthdate: 1234567890,
        userType: 1,
      };

      (userService.create as jest.Mock).mockRejectedValue(
        new HttpException('ERROR: ', HttpStatus.INTERNAL_SERVER_ERROR),
      );

      try {
        await userController.create(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
