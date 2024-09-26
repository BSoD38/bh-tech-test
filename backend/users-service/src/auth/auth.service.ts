import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UserDto } from '../dto/user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<AuthDto> {
    if (!username || !password) {
      throw new HttpException('Invalid request', 400);
    }
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      // User does not exist
      throw new UnauthorizedException();
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Password is wrong
      throw new UnauthorizedException();
    }

    const userDto = UserDto.convertFromEntity(user);
    const dto = new AuthDto();
    dto.user = userDto;
    const payload = { sub: user.id, username: user.username };
    dto.token = await this.jwtService.signAsync(payload);

    return dto;
  }

  async signUp(username: string, password: string): Promise<AuthDto> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      // User already exists
      throw new UnauthorizedException();
    }

    const newUser = new User();
    newUser.username = username;
    newUser.password = await bcrypt.hash(password, SALT_ROUNDS);
    const createdUser = await this.usersService.createUser(newUser);

    const userDto = UserDto.convertFromEntity(createdUser);
    const authDto = new AuthDto();
    authDto.user = userDto;

    const payload = { sub: createdUser.id, username: createdUser.username };
    authDto.token = await this.jwtService.signAsync(payload);

    return authDto;
  }

  async changeUsername(
    token: { sub: number; username: string },
    newUsername: string,
  ): Promise<UserDto> {
    const user = await this.usersService.findOne(token.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    user.username = newUsername;
    return UserDto.convertFromEntity(
      await this.usersService.updateUser(user.id, user, ['username']),
    );
  }
}
