import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RangeParams {
  @ApiProperty()
  start: string;

  @ApiPropertyOptional()
  end?: string;
}
