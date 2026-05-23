import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFileDto {
    @ApiProperty({ enum: ['processing', 'failed', 'successful'] })
    @IsString()
    status: 'processing' | 'failed' | 'successful';

    @ApiProperty({ required: false })
    @IsString()
    output_path?: string;

    @ApiProperty({ required: false })
    @IsString()
    error?: string;
}
