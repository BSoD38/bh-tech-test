import { Test, TestingModule } from '@nestjs/testing';
import { FilteredDataService } from './filtered-data.service';

describe('FilteredDataService', () => {
  let service: FilteredDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilteredDataService],
    }).compile();

    service = module.get<FilteredDataService>(FilteredDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
