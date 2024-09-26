import { ApiProperty } from '@nestjs/swagger';
import { ModifiedData } from '../modified-data/modified-data.entity';

export class ModifiedDataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  rawData: number;

  @ApiProperty()
  filteredData: number;

  @ApiProperty()
  modifiedBy: number;

  @ApiProperty()
  oldValue: number;

  @ApiProperty()
  newValue: number;

  @ApiProperty()
  modifiedAt: Date;

  static convertFromEntity(modifiedData: ModifiedData): ModifiedDataDto {
    const { rawData, filteredData, ...dto } = modifiedData;
    (dto as ModifiedDataDto).rawData = modifiedData.rawData.id;
    (dto as ModifiedDataDto).filteredData = modifiedData.filteredData.id;
    return dto as ModifiedDataDto;
  }
}
