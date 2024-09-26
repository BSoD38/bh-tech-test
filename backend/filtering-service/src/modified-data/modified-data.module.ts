import { Module } from '@nestjs/common';
import { ModifiedDataController } from './modified-data.controller';
import { ModifiedDataService } from './modified-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModifiedData } from './modified-data.entity';
import { JwtModule } from '@nestjs/jwt';
import { RawDataModule } from '../raw-data/raw-data.module';
import { FilteredDataModule } from '../filtered-data/filtered-data.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([ModifiedData]),
    RawDataModule,
    FilteredDataModule,
  ],
  controllers: [ModifiedDataController],
  providers: [ModifiedDataService],
})
export class ModifiedDataModule {}
