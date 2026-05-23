import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: '/path/to/file' })
    path: string;

    @ApiProperty({ example: 'processing' })
    status: 'processing' | 'failed' | 'successful';

    @ApiProperty({ example: '/path/to/output' })
    output_path?: string;

    @ApiProperty({ example: 'Error message' })
    error?: string;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    created_at: Date;

    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    updated_at: Date;
}