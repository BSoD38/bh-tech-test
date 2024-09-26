import { Test, TestingModule } from '@nestjs/testing';
import { FilteredDataService } from './filtered-data.service';
import { MockType, repositoryMockFactory } from '../mocks/repository-mock';
import { Repository } from 'typeorm';
import { FilteredData } from './filtered-data.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RawData } from '../raw-data/raw-data.entity';

describe('FilteredDataService', () => {
  let service: FilteredDataService;
  let filteredRepositoryMock: MockType<Repository<FilteredData>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilteredDataService,
        { provide: getRepositoryToken(FilteredData), useFactory: repositoryMockFactory }
      ],
    }).compile();

    service = module.get<FilteredDataService>(FilteredDataService);
    filteredRepositoryMock = module.get(getRepositoryToken(FilteredData));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the value to the nearest fibonacci sequence number', async () => {
    // So the save method returns the same value as its argument
    filteredRepositoryMock.save.mockImplementation(value => value);

    const date = new Date();
    const rawData = new RawData();
    rawData.value = 58;
    rawData.date = date;
    rawData.id = 42;
    const result = await service.processRawDataAndSave(rawData);
    expect(result.date).toBe(date);
    expect(result.value).toEqual(55);

    rawData.value = 30;
    const result2 = await service.processRawDataAndSave(rawData);
    expect(result2.value).toEqual(34);
  });

  it('should not set the filtered value over the max value', async () => {
    filteredRepositoryMock.save.mockImplementation(value => value);

    const date = new Date();
    const rawData = new RawData();
    rawData.value = 145;
    rawData.date = date;
    rawData.id = 42;
    const result = await service.processRawDataAndSave(rawData);
    expect(result.value).toEqual(100);
  })
});
