import { Injectable } from '@nestjs/common';
import { FileRepository } from '../repository/file.repository';
import { FileDTO } from '../dto/file.dto';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  public async getFileContent(filePath: string): Promise<string> {
    return await this.fileRepository.getFileContent(filePath);
  }

  public async createFile(fileDTO: FileDTO): Promise<{
    name: string;
    id: number;
    path: string;
  }> {
    const { filePath: path, data } = fileDTO;
    return await this.fileRepository.createFile(path, data);
  }
}
