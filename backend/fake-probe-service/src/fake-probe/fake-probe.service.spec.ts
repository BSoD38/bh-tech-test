import { Test, TestingModule } from '@nestjs/testing';
import { FakeProbeService } from './fake-probe.service';

describe('FakeProbeService', () => {
  let service: FakeProbeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FakeProbeService],
    }).compile();

    service = module.get<FakeProbeService>(FakeProbeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
