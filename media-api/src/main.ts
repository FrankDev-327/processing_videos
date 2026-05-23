import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerServ } from './logger/logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerServ);

  if (process.env.NODE_ENV !== 'prod') app.useLogger(logger);
  //TODO : add microservice for nats and connect to it
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_SERVER_URL],
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Chat swagger documentation')
    .setVersion('0.1')
    .setDescription('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/media-docs', app, document);

  await microservice.listen();
  await app.listen(process.env.PORT, () => {
    logger.log(`Server starting at port: ${process.env.PORT}`)
  });
}

bootstrap();
