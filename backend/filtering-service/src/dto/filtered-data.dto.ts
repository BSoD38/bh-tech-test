import { ApiProperty } from '@nestjs/swagger';
import { FilteredData } from '../filtered-data/filtered-data.entity';

export class FilteredDataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  rawDataId: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  date: Date;

  static convertFromEntity(filteredData: FilteredData): FilteredDataDto {
    const dto = new FilteredDataDto();
    dto.id = filteredData.id;
    dto.value = filteredData.value;
    dto.date = filteredData.date;
    dto.rawDataId = filteredData.rawDataId;

    return dto;
  }
}
