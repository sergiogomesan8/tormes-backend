import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../../core/domain/services/auth.service';
import { CreateUserDto } from '../dtos/user.dto';
import { SerializedUser, User } from '../../../core/domain/models/user.model';
import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LoginUserDto } from '../dtos/auth.dto';
import { SerializedAuthModel } from '../../../core/domain/models/auth.model';

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
            login: jest.fn(),
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
  const loginUserDto = new LoginUserDto(email, password);

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

  describe('login', () => {
    it('should return user and token on successful registration', async () => {
      const expectedResponse = {
        user_info: plainToClass(SerializedUser, user),
        token: 'token',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResponse);
      expect(await authController.login(loginUserDto)).toEqual(
        new SerializedAuthModel(expectedResponse),
      );
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
    it('should throw an error on failed login', async () => {
      jest.spyOn(authService, 'login').mockImplementation(() => {
        throw new Error();
      });

      await expect(authController.login(loginUserDto)).rejects.toThrow(
        new HttpException('ERROR: ', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });
});
