import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RawData } from './raw-data.entity';
import { Repository } from 'typeorm';
import { FilteredDataService } from '../filtered-data/filtered-data.service';

@Injectable()
export class RawDataService {
  constructor(
    @InjectRepository(RawData)
    private readonly rawDataRepository: Repository<RawData>,
    private readonly filteredDataService: FilteredDataService,
  ) {}

  async handleRawData({ value, date }: { value: number; date: number }) {
    const rawData = new RawData();
    rawData.value = value;
    rawData.date = new Date(date);

    const newRawData = await this.createRawData(rawData);
    await this.filteredDataService.processRawDataAndSave(newRawData);
  }

  async createRawData(data: RawData): Promise<RawData> {
    return this.rawDataRepository.save(data);
  }

  findById(id: number): Promise<RawData> {
    return this.rawDataRepository.findOneBy({ id });
  }

  getInRange(start: Date, end?: Date): Promise<RawData[]> {
    const qb = this.rawDataRepository
      .createQueryBuilder('rawData')
      .where('rawData.date >= :startDate', { startDate: start });

    if (end) {
      qb.andWhere('rawData.date <= :endDate', { endDate: end });
    }

    return qb.getMany();
  }
}
