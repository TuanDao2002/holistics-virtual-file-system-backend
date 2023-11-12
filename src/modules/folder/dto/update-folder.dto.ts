import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
