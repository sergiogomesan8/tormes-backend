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

  const email = 'user@example.com';
  const password = expect.any(String);
  const name = 'John';

  const createUserDto = new CreateUserDto(name, email, password);

  describe('create', () => {
    it('should return a user entity', async () => {
      const userEntity = new UserEntity();
      (userService.create as jest.Mock).mockResolvedValue(userEntity);

      expect(await userController.create(createUserDto)).toBeInstanceOf(
        UserEntity,
      );
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an exception when userService.create throws an error', async () => {
      (userService.create as jest.Mock).mockRejectedValue(
        new HttpException('ERROR: ', HttpStatus.INTERNAL_SERVER_ERROR),
      );

      await expect(userController.create(createUserDto)).rejects.toBeInstanceOf(
        HttpException,
      );

      await expect(userController.create(createUserDto)).rejects.toHaveProperty(
        'status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
