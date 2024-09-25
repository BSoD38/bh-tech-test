import { Module } from '@nestjs/common';
import { FakeProbeService } from './fake-probe.service';
import { ClientsModule } from '@nestjs/microservices';
import { transportOptions } from '../transport-options';

@Module({
  controllers: [],
  providers: [FakeProbeService],
  imports: [
    ClientsModule.register([
      {
        name: 'FAKE_PROBE_SERVICE',
        ...transportOptions,
      },
    ]),
  ],
})
export class FakeProbeModule {}
