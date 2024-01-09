import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserType } from '../../../../../core/domain/models/user.model';
import { JwtPayload } from '../jwt-playload.interface';
import { RefreshJwtService } from './refresh-jwt.service';

describe('RefreshJwtService', () => {
  let service: RefreshJwtService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshJwtService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_secret'),
          },
        },
      ],
    }).compile();

    service = module.get<RefreshJwtService>(RefreshJwtService);
    jwtService = module.get<JwtService>(JwtService);
  });

  const payload: JwtPayload = {
    email: 'test@test.com',
    id: expect.any(String),
    name: expect.any(String),
    userType: UserType.customer,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a JWT access token', async () => {
    const result = await service.getJwtRefreshToken(payload);

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        payload,
      },
      {
        secret: 'mocked_secret',
      },
    );
    expect(result).toBe('mocked_token');
  });
});
