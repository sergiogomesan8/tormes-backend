import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PostgreConfigService } from './postgres-config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

describe('PostgreConfigService', () => {
  let service: PostgreConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PostgreConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => key),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<PostgreConfigService>(PostgreConfigService);
  });

  it('should return correct TypeOrmModuleOptions', async () => {
    const result = await service.createTypeOrmOptions();
    expect(result).toEqual({
      type: 'postgres',
      host: 'POSTGRES_HOST',
      port: 'POSTGRES_PORT',
      username: 'POSTGRES_USER',
      password: 'POSTGRES_PASSWORD',
      database: 'POSTGRES_DB',
      entities: [expect.any(String)],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
      namingStrategy: expect.any(SnakeNamingStrategy),
    });
  });
});
