import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class AuthDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  token: string;
}
