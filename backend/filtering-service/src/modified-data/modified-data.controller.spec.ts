import { Test, TestingModule } from '@nestjs/testing';
import { ModifiedDataController } from './modified-data.controller';

describe('ModifiedDataController', () => {
  let controller: ModifiedDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModifiedDataController],
    }).compile();

    controller = module.get<ModifiedDataController>(ModifiedDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
