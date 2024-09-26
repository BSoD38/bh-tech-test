import {
  Controller,
  Get,
  HttpException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RawDataService } from './raw-data.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { RangeParams } from '../dto/range-params.dto';
import { RawData } from './raw-data.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('raw-data')
export class RawDataController {
  constructor(private readonly rawDataService: RawDataService) {}

  @EventPattern('fake_probe')
  async handleRawDataMessage(@Payload() data: { value: number; date: number }) {
    await this.rawDataService.handleRawData(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Get all raw data points in date range',
    type: RawData,
    isArray: true,
  })
  getRange(@Query() query: RangeParams): Promise<RawData[]> {
    if (!query.start) {
      throw new HttpException('Missing required start date', 400);
    }
    const start = Date.parse(query.start);
    if (!start) {
      throw new HttpException('Start date is invalid', 400);
    }
    const end = Date.parse(query.end);
    if (end) {
      return this.rawDataService.getInRange(new Date(start), new Date(end));
    } else {
      return this.rawDataService.getInRange(new Date(start));
    }
  }
}
