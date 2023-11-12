import { IsString } from 'class-validator';

export class CreateFolderDTO {
  @IsString()
  path: string;
}
