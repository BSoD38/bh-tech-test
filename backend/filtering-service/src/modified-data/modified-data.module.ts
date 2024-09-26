import { Module } from '@nestjs/common';
import { ModifiedDataController } from './modified-data.controller';
import { ModifiedDataService } from './modified-data.service';

@Module({
  controllers: [ModifiedDataController],
  providers: [ModifiedDataService]
})
export class ModifiedDataModule {}
