import { Module } from '@nestjs/common';
import { FakeProbeModule } from './fake-probe/fake-probe.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), FakeProbeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
