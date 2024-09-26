import { ApiProperty } from '@nestjs/swagger';

export class FilteredDataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  rawData: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  date: Date;
}
