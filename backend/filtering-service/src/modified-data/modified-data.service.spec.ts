import { Test, TestingModule } from '@nestjs/testing';
import { ModifiedDataService } from './modified-data.service';

describe('ModifiedDataService', () => {
  let service: ModifiedDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModifiedDataService],
    }).compile();

    service = module.get<ModifiedDataService>(ModifiedDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
