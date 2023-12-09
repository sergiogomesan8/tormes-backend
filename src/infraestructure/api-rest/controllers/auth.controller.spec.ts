import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../../core/domain/services/auth.service';
import { CreateUserDto } from '../dtos/user.dto';
import { SerializedUser, User } from '../../../core/domain/models/user.model';
import { HttpException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  const user = { name: 'Test User' } as User;

  const email = 'user@example.com';
  const password = expect.any(String);
  const name = 'John';

  const createUserDto = new CreateUserDto(name, email, password);

  describe('register', () => {
    it('should return user and token on successful registration', async () => {
      const expectedResponse = {
        user_info: plainToClass(SerializedUser, user),
        token: 'token',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResponse);

      expect(await authController.register(createUserDto)).toEqual(
        expectedResponse,
      );
    });

    it('should throw an error when registration fails', async () => {
      jest.spyOn(authService, 'register').mockImplementation(() => {
        throw new Error();
      });

      await expect(authController.register(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
