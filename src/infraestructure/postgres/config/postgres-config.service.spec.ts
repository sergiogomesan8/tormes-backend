import { Test, TestingModule } from '@nestjs/testing';
import { PostgreConfigService } from './postgres-config.service';

describe('PostgreconfigService', () => {
  let service: PostgreConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgreConfigService],
    }).compile();

    service = module.get<PostgreConfigService>(PostgreConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
