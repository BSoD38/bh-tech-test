import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  static convertFromEntity(user: User): UserDto {
    const { password, ...userData } = user;
    return userData as UserDto;
  }
}
