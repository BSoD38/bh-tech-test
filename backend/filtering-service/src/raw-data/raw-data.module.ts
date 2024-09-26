import { Module } from '@nestjs/common';
import { RawDataController } from './raw-data.controller';
import { RawDataService } from './raw-data.service';
import { FilteredDataModule } from '../filtered-data/filtered-data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawData } from './raw-data.entity';

@Module({
  controllers: [RawDataController],
  providers: [RawDataService],
  imports: [TypeOrmModule.forFeature([RawData]), FilteredDataModule],
  exports: [RawDataService],
})
export class RawDataModule {}
