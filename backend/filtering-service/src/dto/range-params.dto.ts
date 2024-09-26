import { ApiProperty } from '@nestjs/swagger';

export class RangeParams {
  @ApiProperty()
  start: string;

  @ApiProperty()
  end?: string;
}
