import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  data?: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDate()
  created_at?: Date;
}
