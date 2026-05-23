import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFileDto {
    @ApiProperty()
    @IsString()
    path: string;
}
