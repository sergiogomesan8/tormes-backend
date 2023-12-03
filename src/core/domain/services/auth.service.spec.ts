import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Gender, User } from '../models/user.model';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn().mockResolvedValue({} as User),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

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
    it('should register a user', async () => {
      const user = { email: 'test@test.com' };
      const token = 'token';

      jest
        .spyOn(userService, 'create')
        .mockImplementation(async () => user as User);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => token);

      expect(await authService.register(createUserDto)).toEqual({
        user,
        token,
      });
    });

    it('should throw an error if userService.create fails', async () => {
      jest.spyOn(userService, 'create').mockImplementation(async () => {
        throw new Error('User creation failed');
      });

      await expect(authService.register(createUserDto)).rejects.toThrow(
        'User creation failed',
      );
    });

    it('should throw an error if jwtService.sign fails', async () => {
      jest
        .spyOn(userService, 'create')
        .mockImplementation(async () => ({}) as User);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error('Token creation failed');
      });

      await expect(authService.register(createUserDto)).rejects.toThrow(
        'Token creation failed',
      );
    });
  });
});
