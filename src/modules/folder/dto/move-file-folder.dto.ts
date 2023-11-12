import { IsOptional, IsString } from 'class-validator';

export class MoveFileOrFolderDTO {
  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  folderPath?: string;
}
