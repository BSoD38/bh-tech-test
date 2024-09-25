import { Test, TestingModule } from '@nestjs/testing';
import { FilteredDataController } from './filtered-data.controller';

describe('FilteredDataController', () => {
  let controller: FilteredDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilteredDataController],
    }).compile();

    controller = module.get<FilteredDataController>(FilteredDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
