import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { FileEntity } from '../entities/files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerServ } from '../logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER_URL],
        },
      },
    ]),
  ],
  providers: [MediaService, {
    provide: LoggerServ,
    useValue: new LoggerServ(MediaService.name),
  }],
  controllers: [MediaController]
})
export class MediaModule { }
