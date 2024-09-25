import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { FilteredData } from './filtered-data.entity';
import { RangeParams } from '../dto/range-params.dto';
import { FilteredDataService } from './filtered-data.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('filtered-data')
export class FilteredDataController {
  constructor(private readonly filteredDataService: FilteredDataService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get all filtered data points in date range',
    type: FilteredData,
    isArray: true,
  })
  getRange(@Query() query: RangeParams): Promise<FilteredData[]> {
    if (!query.start) {
      throw new HttpException('Missing required start date', 400);
    }
    const start = Date.parse(query.start);
    if (!start) {
      throw new HttpException('Start date is invalid', 400);
    }
    const end = Date.parse(query.end);
    if (end) {
      return this.filteredDataService.getInRange(
        new Date(start),
        new Date(end),
      );
    } else {
      return this.filteredDataService.getInRange(new Date(start));
    }
  }
}
