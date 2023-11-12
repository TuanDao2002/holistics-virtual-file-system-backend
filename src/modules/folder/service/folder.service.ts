import { Injectable } from '@nestjs/common';
import { FolderRepository } from '../repository/folder.repository';
import { CreateFolderDTO } from '../dto/create-folder.dto';
import { FileRepository } from '../../file/repository/file.repository';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  public async listFolder(path: string): Promise<any> {
    return await this.folderRepository.listFolder(path);
  }

  public async createFolder(folderData: CreateFolderDTO): Promise<{
    id: number;
    name: string;
    path: string;
  }> {
    const { path } = folderData;
    return await this.folderRepository.createFolder(path);
  }

  public async removeFilesOrFolders(paths: string[]): Promise<void> {
    await Promise.all([
      this.fileRepository.removeFiles(paths),
      this.folderRepository.removeFolders(paths),
    ]);
  }
}
