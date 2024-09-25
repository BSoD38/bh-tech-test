import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';

const MAX_VALUE = 150;
const MIN_VALUE = -10;

@Injectable()
export class FakeProbeService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject('FAKE_PROBE_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Timeout('fakeProbe', 3000)
  generateFakeProbe() {
    this.schedulerRegistry.deleteTimeout('fakeProbe');

    // Generate a random number between MIN_VALUE and MAX_VALUE
    const newValue = Math.round(
      Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE,
    );

    // Re-run this method after 2000-4000ms
    const timeout = setTimeout(
      () => {
        this.generateFakeProbe();
      },
      Math.random() * 2000 + 2000,
    );
    this.schedulerRegistry.addTimeout('fakeProbe', timeout);
    // Emit data to rabbitmq
    this.client.emit('fake_probe', { value: newValue, date: Date.now() });
  }
}
