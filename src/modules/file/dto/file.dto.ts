import { IsString } from "class-validator";

export class FileDTO {
    @IsString()
    filePath: string;

    @IsString()
    data: string
}