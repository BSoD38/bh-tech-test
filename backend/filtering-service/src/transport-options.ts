import { RmqOptions, Transport } from '@nestjs/microservices';

export const transportOptions: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@rabbitmq:5672`,
    ],
    queue: 'raw_data_queue',
    queueOptions: {
      durable: true,
    },
  },
};
