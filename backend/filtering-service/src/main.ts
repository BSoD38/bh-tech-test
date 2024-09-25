import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RmqOptions } from '@nestjs/microservices';
import { transportOptions } from './transport-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('filtering');
  const config = new DocumentBuilder()
    .setTitle('Filtering Service')
    .setDescription('Handles graph data')
    .setVersion('1.0')
    .addTag('filtering')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Connects to fake-probe-service
  app.connectMicroservice<RmqOptions>(transportOptions);

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
