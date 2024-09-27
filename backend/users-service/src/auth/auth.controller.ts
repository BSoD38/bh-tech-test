import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/signin.dto';
import { AuthDto } from '../dto/auth.dto';
import { SignUpDto } from '../dto/signup.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login response',
    type: AuthDto,
  })
  @Post('signin')
  signIn(@Body() signInDto: SignInDto): Promise<AuthDto> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get user from token',
    type: AuthDto,
  })
  @Get('me')
  async me(@Req() request: Request): Promise<UserDto> {
    const token = request['user'];
    const user = await this.usersService.findOne(token.sub);
    return user ? UserDto.convertFromEntity(user) : null;
  }

  // TODO: JWT token refresh

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Sign up response',
    type: AuthDto,
  })
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<AuthDto> {
    return this.authService.signUp(signUpDto.username, signUpDto.password);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('change-username')
  changeUsername(
    @Req() request: Request,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserDto> {
    return this.authService.changeUsername(
      request['user'],
      userUpdateDto.username,
    );
  }
}
