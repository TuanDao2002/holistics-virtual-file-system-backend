import { Injectable } from '@nestjs/common';
import { FolderRepository } from '../repository/folder.repository';
import { CreateFolderDTO } from '../dto/create-folder.dto';

@Injectable()
export class FolderService {
  constructor(private readonly folderRepository: FolderRepository) {}

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
}
