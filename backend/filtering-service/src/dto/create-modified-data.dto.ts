import { ApiProperty } from '@nestjs/swagger';

export class CreateModifiedDataDto {
  @ApiProperty()
  rawDataId: number;
}
