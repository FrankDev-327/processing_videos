import { IsString } from "class-validator";

export class HandleFileResultDto {
    @IsString()
    id: string;

    @IsString()
    status: 'successful' | 'failed';

    @IsString()
    output_path?: string;

    @IsString()
    error?: string;
}