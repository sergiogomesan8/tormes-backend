import { UserController } from './user.controller';
import { UserService } from '../../../core/domain/services/user.service';
import { CreateUserDto } from '../dtos/user.dto';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { SerializedUser, User } from '../../../core/domain/models/user.model';
import { plainToClass } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  const user = { name: 'Test User' } as User;

  const email = 'user@example.com';
  const password = expect.any(String);
  const name = 'John';

  const createUserDto = new CreateUserDto(name, email, password);

  describe('createUser', () => {
    it('should return a user on successful creation', async () => {
      const serializedUser = plainToClass(SerializedUser, user);

      jest.spyOn(userService, 'createUser').mockResolvedValue(user);

      expect(await userController.createUser(createUserDto)).toEqual(
        serializedUser,
      );
    });

    it('should throw an exception when userService.create throws an error', async () => {
      jest.spyOn(userService, 'createUser').mockImplementation(() => {
        throw new InternalServerErrorException('Error creating user');
      });

      await expect(userController.createUser(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
