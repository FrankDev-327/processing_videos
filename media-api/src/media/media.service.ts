import * as fs from 'fs';
import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities/files.entity';
import { CreateFileDto } from '../dto/create.file.dto';
import { UpdateFileDto } from '../dto/update.file.dto';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerServ } from '../logger/logger.service';

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
        private readonly loggerServ: LoggerServ
    ) { }

    async create(createFileDto: CreateFileDto): Promise<FileEntity> {
        try {
            const file = this.fileRepository.create(createFileDto);
            const saved = await this.fileRepository.save(file);

            this.natsClient.emit('file.process', {
                id: saved.id,
                path: saved.path
            });

            return saved;
        } catch (error) {
            this.loggerServ.error(error)
        }
    }

    async findAll(): Promise<FileEntity[]> {
        try {
            return this.fileRepository.find();
        } catch (error) {
            this.loggerServ.error(error)
        }
    }

    async findOne(id: string): Promise<FileEntity> {
        try {
            return this.fileRepository.findOneBy({ id });
        } catch (error) {
            this.loggerServ.error(error)
        }
    }

    async update(id: string, updateFileDto: UpdateFileDto): Promise<FileEntity> {
        try {
            await this.fileRepository.update(id, updateFileDto);
            return await this.fileRepository.findOneBy({ id });
        } catch (error) {
            this.loggerServ.error(error)
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const file = await this.findOne(id);
            if (!file) return;

            if (file.output_path) {
                try {
                    fs.unlinkSync(file.output_path);
                } catch (error) {
                    this.loggerServ.error(`Could not delete file from disk: ${error}`);
                }
            }

            await this.fileRepository.delete(id);
        } catch (error) {
            this.loggerServ.error(error)
        }
    }
}   
