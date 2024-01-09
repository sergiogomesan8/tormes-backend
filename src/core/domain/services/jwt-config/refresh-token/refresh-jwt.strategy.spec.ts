import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../../../../infraestructure/postgres/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtPayload } from '../jwt-playload.interface';
import { UserType } from '../../../../../core/domain/models/user.model';
import { JwtRefreshTokenStrategy } from './refresh-jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { AccessJwtService } from '../access-token/access-jwt.service';

describe('JwtStrategy', () => {
  let jwtRefreshTokenStrategy: JwtRefreshTokenStrategy;
  let userRepository: Repository<UserEntity>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccessJwtService,
        JwtRefreshTokenStrategy,
        JwtService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('testKey') },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
      imports: [ConfigModule],
    }).compile();

    jwtRefreshTokenStrategy = module.get<JwtRefreshTokenStrategy>(
      JwtRefreshTokenStrategy,
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    configService = module.get<ConfigService>(ConfigService);
  });

  it('validates and returns the user based on JWT payload', async () => {
    const payload: JwtPayload = {
      email: 'test@test.com',
      id: expect.any(String),
      name: expect.any(String),
      userType: UserType.customer,
    };

    const user = new UserEntity();
    user.email = 'test@test.com';

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as any);
    jest.spyOn(configService, 'get').mockReturnValue('testKey');

    const result = await jwtRefreshTokenStrategy.validate({ payload });

    expect(result).toEqual(user);
  });

  it('throws an unauthorized exception as user cannot be found', async () => {
    const payload: JwtPayload = {
      email: 'test@test.com',
      id: expect.any(String),
      name: expect.any(String),
      userType: UserType.customer,
    };

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(configService, 'get').mockReturnValue('testKey');

    try {
      await jwtRefreshTokenStrategy.validate({ payload });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
