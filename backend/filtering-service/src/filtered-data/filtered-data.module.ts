import { Module } from '@nestjs/common';
import { FilteredDataController } from './filtered-data.controller';
import { FilteredDataService } from './filtered-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilteredData } from './filtered-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FilteredData])],
  controllers: [FilteredDataController],
  providers: [FilteredDataService],
  exports: [FilteredDataService],
})
export class FilteredDataModule {}
