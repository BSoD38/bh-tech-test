import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ModifiedData } from './modified-data.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateModifiedDataDto } from '../dto/create-modified-data.dto';
import { FilteredDataService } from '../filtered-data/filtered-data.service';
import { RawDataService } from '../raw-data/raw-data.service';

@Injectable()
export class ModifiedDataService {
  constructor(
    @InjectRepository(ModifiedData)
    private readonly modifiedDataRepository: Repository<ModifiedData>,
    private readonly filteredDataService: FilteredDataService,
    private readonly rawDataService: RawDataService,
  ) {}

  async createModifiedData(
    data: CreateModifiedDataDto,
    userId: number,
  ): Promise<ModifiedData> {
    if (!userId) {
      throw new HttpException('User ID is missing', 400);
    }
    if (!data.rawDataId) {
      throw new HttpException('Raw data ID is missing', 400);
    }

    const rawData = await this.rawDataService.findById(data.rawDataId);
    if (!rawData) {
      throw new HttpException(
        `Could not find raw data with ID ${data.rawDataId}`,
        400,
      );
    }

    const filteredData = await this.filteredDataService.findByRawData(rawData);
    if (!filteredData) {
      throw new HttpException(
        `Could not find filtered data linked to given raw data`,
        400,
      );
    }

    const modifiedData = new ModifiedData();
    modifiedData.rawData = rawData;
    modifiedData.filteredData = filteredData;
    modifiedData.modifiedBy = userId;
    modifiedData.oldValue = rawData.value;
    modifiedData.newValue = filteredData.value;
    modifiedData.date = rawData.date;

    return this.modifiedDataRepository.save(modifiedData);
  }

  getInRange(start: Date, end?: Date): Promise<ModifiedData[]> {
    const qb = this.modifiedDataRepository
      .createQueryBuilder('modifiedData')
      .where('modifiedData.modifiedAt >= :startDate', { startDate: start });

    if (end) {
      qb.andWhere('modifiedData.modifiedAt <= :endDate', { endDate: end });
    }

    return qb.orderBy('date').getMany();
  }
}
