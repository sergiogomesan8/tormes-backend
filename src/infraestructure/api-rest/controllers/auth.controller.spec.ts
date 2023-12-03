import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../../core/domain/services/auth.service';
import { CreateUserDto, Gender } from '../dtos/user.dto';
import { User } from '../../../core/domain/models/user.model';
import { HttpException } from '@nestjs/common';

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
  const createUserDto: CreateUserDto = {
    email: 'test@test.com',
    password: expect.any(String),
    name: 'Sergio',
    lastName: 'Gómez',
    deliveryAddres: 'Wall Street',
    billingAddres: 'Calle Falsa 123',
    postalCode: 0,
    gender: Gender.man,
    birthdate: 0,
  };

  describe('register', () => {
    it('should return user and token on successful registration', async () => {
      const expectedResponse = {
        user,
        token: 'token',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResponse);

      expect(await authController.register(createUserDto)).toBe(
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
