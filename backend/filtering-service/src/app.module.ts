import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilteredDataModule } from './filtered-data/filtered-data.module';
import { RawDataModule } from './raw-data/raw-data.module';
import { ModifiedDataModule } from './modified-data/modified-data.module';
import * as process from 'node:process';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: process.env.BACKEND_DB_USERNAME,
      password: process.env.BACKEND_DB_PASSWORD,
      database: 'app',
      autoLoadEntities: true,
      synchronize: true,
    }),
    FilteredDataModule,
    RawDataModule,
    ModifiedDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
