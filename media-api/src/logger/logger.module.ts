import { Module } from '@nestjs/common';
import { LoggerServ } from './logger.service';
import { Global } from '@nestjs/common';

@Global()
@Module({
  exports: [LoggerServ],
  providers: [
    {
      provide: LoggerServ,
      useFactory: () => {
        const fileCustomName = 'application';
        return new LoggerServ(fileCustomName);
      },
    },
  ],
})
export class LoggerModule { }
