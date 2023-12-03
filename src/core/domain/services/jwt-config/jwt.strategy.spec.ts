import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from '../../../../infraestructure/postgres/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: Repository<UserEntity>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
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

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    configService = module.get<ConfigService>(ConfigService);
  });

  it('validates and returns the user based on JWT payload', async () => {
    const payload = { email: 'test@test.com' };
    const user = new UserEntity();
    user.email = 'test@test.com';

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as any);
    jest.spyOn(configService, 'get').mockReturnValue('testKey');

    const result = await jwtStrategy.validate(payload);

    expect(result).toEqual(user);
  });

  it('throws an unauthorized exception as user cannot be found', async () => {
    const payload = { email: 'test@test.com' };

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(configService, 'get').mockReturnValue('testKey');

    try {
      await jwtStrategy.validate(payload);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
