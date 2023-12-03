import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../../core/domain/services/auth.service';
import {
  CreateUserDto,
  CreateUserDtoBuilder,
  Gender,
  UserType,
} from '../dtos/user.dto';
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
  const createUserDto: CreateUserDto = new CreateUserDtoBuilder()
    .setEmail('test@test.com')
    .setPassword('Password123*')
    .setName('Sergio')
    .setLastName('Gómez')
    .setPhoneNumber(1234567890)
    .setDeliveryAddres('Wall Street')
    .setBillingAddres('Calle Falsa 123')
    .setPostalCode(12345)
    .setGender(Gender.man)
    .setBirthdate(0)
    .setUserType(UserType.customer)
    .build();

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
