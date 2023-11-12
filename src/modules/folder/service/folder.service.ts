import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FolderRepository } from '../repository/folder.repository';
import { CreateFolderDTO } from '../dto/create-folder.dto';
import { FileRepository } from '../../file/repository/file.repository';
import { Database } from '../../../database/database';

@Injectable()
export class FolderService {
  constructor(
    private readonly database: Database,
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

  public async moveFileOrFolder(
    path: string,
    parentFolderPath: string = null,
  ): Promise<void> {
    if (parentFolderPath && parentFolderPath.indexOf(path) == 0) {
      throw new BadRequestException(
        `${parentFolderPath} is sub-path of ${path}`,
      );
    }

    const [file, folder] = await Promise.all([
      this.fileRepository.getFile(path),
      this.folderRepository.getFolder(path),
    ]);

    if (file != null) {
      await this.database.transaction().execute(async (trx) => {
        await this.fileRepository.removeFiles([path]);
        const newFile = await this.fileRepository.createFile(
          parentFolderPath ? `${parentFolderPath}/${file.name}` : file.name,
          file.data,
        );
        await this.fileRepository.updateFile(newFile.id, {
          created_at: file.created_at,
        });
      });
    } else if (folder != null) {
      let parentFolder: any;
      if (!parentFolderPath) {
        parentFolder = null;
      } else {
        parentFolder = await this.folderRepository.getFolder(parentFolderPath);
        if (!parentFolder) {
          throw new NotFoundException('Parent folder not exist');
        }
      }

      this.database.transaction().execute(async (trx) => {
        await this.folderRepository.updateFolder(folder.id, {
          parent_id: !parentFolder ? null : parentFolder.id,
          path: !parentFolder ? null : parentFolderPath,
        });

        await this.fileRepository.updateFilesInFolder(folder.id, {
          path: parentFolderPath
            ? `${parentFolderPath}/${folder.name}`
            : folder.name,
        });

        await this.folderRepository.updateFolder(parentFolder.id, {
          size: (parentFolder ? parentFolder.size : 0) + folder.size,
        });
      });
    } else {
      throw new NotFoundException('Path not exist');
    }
  }

  public async removeFilesOrFolders(paths: string[]): Promise<void> {
    await Promise.all([
      this.fileRepository.removeFiles(paths),
      this.folderRepository.removeFolders(paths),
    ]);
  }
}
