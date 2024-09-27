import { Body, Controller, Get, HttpException, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateModifiedDataDto } from '../dto/create-modified-data.dto';
import { ModifiedDataDto } from '../dto/modified-data.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ModifiedDataService } from './modified-data.service';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import { RangeParams } from '../dto/range-params.dto';

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

  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Get all raw data points in date range',
    type: ModifiedDataDto,
    isArray: true,
  })
  async getRange(@Query() query: RangeParams): Promise<ModifiedDataDto[]> {
    if (!query.start) {
      throw new HttpException('Missing required start date', 400);
    }
    const start = Date.parse(query.start);
    if (!start) {
      throw new HttpException('Start date is invalid', 400);
    }
    const end = Date.parse(query.end);
    if (end) {
      const result = await this.modifiedDataService.getInRange(new Date(start), new Date(end));
      return result.map(d => ModifiedDataDto.convertFromEntity(d));
    } else {
      const result = await this.modifiedDataService.getInRange(new Date(start));
      return result.map(d => ModifiedDataDto.convertFromEntity(d));
    }
  }
}
