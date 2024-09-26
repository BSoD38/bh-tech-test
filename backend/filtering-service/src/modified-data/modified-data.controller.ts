import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateModifiedDataDto } from '../dto/create-modified-data.dto';
import { ModifiedDataDto } from '../dto/modified-data.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ModifiedDataService } from './modified-data.service';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';

@Controller('modified-data')
export class ModifiedDataController {
  constructor(private readonly modifiedDataService: ModifiedDataService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOkResponse({
    description: 'Sign up response',
    type: ModifiedDataDto,
  })
  async createModifiedData(
    @Req() request: Request,
    @Body() modifiedDataDto: CreateModifiedDataDto,
  ): Promise<ModifiedDataDto> {
    const token = request['user'];
    return ModifiedDataDto.convertFromEntity(
      await this.modifiedDataService.createModifiedData(
        modifiedDataDto,
        token.sub,
      ),
    );
  }
}
