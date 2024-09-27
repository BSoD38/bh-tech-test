import { ApiProperty } from '@nestjs/swagger';
import { ModifiedData } from '../modified-data/modified-data.entity';

export class ModifiedDataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  rawDataId: number;

  @ApiProperty()
  filteredDataId: number;

  @ApiProperty()
  modifiedBy: number;

  @ApiProperty()
  oldValue: number;

  @ApiProperty()
  newValue: number;

  @ApiProperty()
  modifiedAt: Date;

  @ApiProperty()
  date: Date;

  static convertFromEntity(modifiedData: ModifiedData): ModifiedDataDto {
    const dto = new ModifiedDataDto();
    dto.id = modifiedData.id;
    dto.rawDataId = modifiedData.rawDataId;
    dto.filteredDataId = modifiedData.filteredDataId;
    dto.modifiedBy = modifiedData.modifiedBy;
    dto.oldValue = modifiedData.oldValue;
    dto.newValue = modifiedData.newValue;
    dto.modifiedAt = modifiedData.modifiedAt;
    dto.date = modifiedData.date;
    return dto as ModifiedDataDto;
  }
}
