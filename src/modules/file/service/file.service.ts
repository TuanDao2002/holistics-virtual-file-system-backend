import { Injectable } from '@nestjs/common';
import { FileRepository } from '../repository/file.repository';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  public async getFileContent(
    fileName: string,
    path: string = null,
  ): Promise<string> {
    return await this.fileRepository.getFileContent(fileName, path);
  }
}
