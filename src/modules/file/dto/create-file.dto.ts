import { IsString } from 'class-validator';

export class CreateFileDTO {
  @IsString()
  filePath: string;

  @IsString()
  data: string;
}
