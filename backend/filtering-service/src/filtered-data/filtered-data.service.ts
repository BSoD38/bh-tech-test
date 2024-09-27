import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilteredData } from './filtered-data.entity';
import { fibonacciMaxValue, nearestValue } from './fibonacci-helpers';
import { RawData } from '../raw-data/raw-data.entity';

const MAX_VALUE = 100;

@Injectable()
export class FilteredDataService {
  sequence: number[];

  constructor(
    @InjectRepository(FilteredData)
    private readonly filteredDataRepository: Repository<FilteredData>,
  ) {
    this.sequence = fibonacciMaxValue(MAX_VALUE);
  }

  processRawDataAndSave(data: RawData): Promise<FilteredData> {
    const filteredData = new FilteredData();
    filteredData.value = nearestValue(data.value, 0, MAX_VALUE, this.sequence);
    filteredData.date = data.date;
    filteredData.rawData = data;
    return this.createFilteredData(filteredData);
  }

  createFilteredData(data: FilteredData): Promise<FilteredData> {
    return this.filteredDataRepository.save(data);
  }

  findById(id: number): Promise<FilteredData> {
    return this.filteredDataRepository.findOneBy({ id });
  }

  findByRawData(data: RawData): Promise<FilteredData> {
    return this.filteredDataRepository.findOneBy({ rawData: data });
  }

  getInRange(start: Date, end?: Date): Promise<FilteredData[]> {
    const qb = this.filteredDataRepository
      .createQueryBuilder('filteredData')
      .where('filteredData.date >= :startDate', { startDate: start });

    if (end) {
      qb.andWhere('filteredData.date <= :endDate', { endDate: end });
    }

    return qb.orderBy('date').getMany();
  }
}
