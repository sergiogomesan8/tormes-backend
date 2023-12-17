import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.model';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { LoginUserDto } from '../../../infraestructure/api-rest/dtos/auth.dto';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

  const email = 'user@example.com';
  const password = expect.any(String);
  const name = 'John';

  const createUserDto = new CreateUserDto(name, email, password);
  const loginUserDto = new LoginUserDto(email, password);

  describe('register', () => {
    it('should register a user', async () => {
      const user = { email: 'test@test.com' };
      const token = 'token';

      jest
        .spyOn(userService, 'createUser')
        .mockImplementation(async () => user as User);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(password);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => token);

      expect(await authService.register(createUserDto)).toEqual({
        user_info: user,
        token,
      });
    });

    it('should throw an error if userService.create fails', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(password);
      jest.spyOn(userService, 'createUser').mockImplementation(async () => {
        throw new InternalServerErrorException('Error creating user');
      });

      await expect(authService.register(createUserDto)).rejects.toThrow(
        new InternalServerErrorException('Error creating user'),
      );
    });

    it('should throw an error if jwtService.sign fails', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(password);
      jest
        .spyOn(userService, 'createUser')
        .mockImplementation(async () => ({}) as User);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new InternalServerErrorException('Error creating user');
      });

      await expect(authService.register(createUserDto)).rejects.toThrow(
        new InternalServerErrorException('Error creating user'),
      );
    });
  });

  describe('login', () => {
    it('should return auth model if credentials are valid', async () => {
      const user = {
        email: 'test@test.com',
        password: bcrypt.hashSync(expect.any(String), AuthService.SALT_ROUNDS),
      };
      const token = 'token';

      jest
        .spyOn(userService, 'findUserByEmail')
        .mockImplementation(async () => user as User);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => token);

      expect(await authService.login(loginUserDto)).toEqual({
        user_info: user,
        token,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest
        .spyOn(userService, 'findUserByEmail')
        .mockImplementation(async () => {
          throw new InternalServerErrorException('Error logging user');
        });

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new InternalServerErrorException('Error logging user'),
      );
    });

    it('should throw UnauthorizedException if password not valid', async () => {
      const user = {
        email: 'test@test.com',
        password: bcrypt.hashSync(expect.any(String), AuthService.SALT_ROUNDS),
      };

      jest
        .spyOn(userService, 'findUserByEmail')
        .mockImplementation(async () => user as User);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new InternalServerErrorException('Error logging user'),
      );
    });
  });
});
