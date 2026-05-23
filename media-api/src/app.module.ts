import { Module } from '@nestjs/common';
import { dbdatasource } from '../orm';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { MediaModule } from './media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    MediaModule,
    TypeOrmModule.forRoot(dbdatasource)
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
