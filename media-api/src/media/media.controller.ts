
import { MediaService } from './media.service';
import { CreateFileDto } from '../dto/create.file.dto';
import { UpdateFileDto } from '../dto/update.file.dto';
import { FileResponseDto } from '../response/file.resource';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HandleFileResultDto } from '../dto/update.handle.file.result.dto';
import { Controller, Post, Delete, Body, Param, Get } from '@nestjs/common';

import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { FileEntity } from '../entities/files.entity';

@ApiTags('Media')
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @ApiOperation({ summary: 'Insert a new media item' })
    @ApiBadRequestResponse({ status: '4XX' })
    @ApiOkResponse({ type: FileResponseDto })
    @Post()
    async create(@Body() createFileDto: CreateFileDto): Promise<FileEntity> {
        return this.mediaService.create(createFileDto);
    }

    @MessagePattern('file.result')
    async handleFileResult(@Payload() data: HandleFileResultDto) {
        const body: UpdateFileDto = {
            status: data.status,
            output_path: data.output_path,
            error: data.error,
        }      
        await this.mediaService.update(data.id, body);
    }

    @Get()
    @ApiOkResponse({ type: [FileResponseDto] })
    @ApiOperation({ summary: 'Get all media items' })
    async findAll(): Promise<FileEntity[]> {
        return this.mediaService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ type: FileResponseDto })
    @ApiOperation({ summary: 'Get a media item by id' })
    @ApiBadRequestResponse({ status: '4XX' })
    async findOne(@Param('id') id: string): Promise<FileEntity> {
        return this.mediaService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a media item by id' })
    async remove(@Param('id') id: string): Promise<void>  {
        return this.mediaService.remove(id);
    }
}
