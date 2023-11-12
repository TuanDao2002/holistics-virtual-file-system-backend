import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Database } from '../../../database/database';
import { Constant } from '../../../common/constant';
import extractPath from '../../../utility/extractPath';
import { FolderRepository } from '../../folder/repository/folder.repository';

@Injectable()
export class FileRepository {
  constructor(
    private readonly database: Database,
    private readonly folderRepository: FolderRepository,
  ) {}

  public async getFile(filePath: string): Promise<any> {
    const [fileName, parentPath] = extractPath(filePath);

    if (!fileName.match(Constant.NAME_REGEX)) {
      throw new BadRequestException(`Invalid file name ${fileName}`);
    }

    const file = await this.database
      .selectFrom('files')
      .selectAll()
      .where('name', '=', fileName)
      .where('path', parentPath === null ? 'is' : '=', parentPath)
      .executeTakeFirst();
    if (!file) {
      return null;
    }

    return file;
  }

  public async getFileContent(filePath: string = null): Promise<string> {
    const file = await this.getFile(filePath);
    if (!file) throw new NotFoundException('File not exist');
    return file.data;
  }

  public async createFile(
    path: string,
    data: string,
  ): Promise<{
    name: string;
    id: number;
    path: string;
  }> {
    const [fileName, parentPath] = extractPath(path);
    if (!fileName.match(Constant.NAME_REGEX)) {
      throw new BadRequestException('Invalid file name');
    }

    return await this.database.transaction().execute(async (trx) => {
      const parentFolder = await this.folderRepository.getFolder(parentPath);
      if (!parentFolder) throw new NotFoundException('Parent folder not exist');

      const existingFile = await this.getFile(path);
      if (existingFile) {
        throw new BadRequestException('File already exist');
      }

      await this.folderRepository.updateFolder(parentFolder.id, {
        size: parentFolder.size + data.length,
      });

      return await trx
        .insertInto('files')
        .values({
          name: fileName,
          data,
          size: data.length,
          parent_id: parentFolder === null ? null : parentFolder.id,
          path: parentFolder === null ? null : parentPath,
        })
        .returning(['id', 'name', 'path'])
        .executeTakeFirstOrThrow();
    });
  }

  public async removeFiles(paths: string[]): Promise<void> {
    let checkFilePaths = [];
    paths.forEach((path) => {
      checkFilePaths.push(this.getFile(path));
    });
    const validFiles = await Promise.all(checkFilePaths);
    let fileIdsToDelete: number[] = [];
    validFiles.forEach((file) => {
      if (file != null) {
        fileIdsToDelete.push(file.id);
      }
    });

    if (fileIdsToDelete.length == 0) return;

    return await this.database.transaction().execute(async (trx) => {
      await trx
        .updateTable('folders as f')
        .from('files')
        .set((eb) => ({
          size: eb('f.size', '-', eb.ref('files.size')),
        }))
        .where('files.id', 'in', fileIdsToDelete)
        .whereRef('f.id', '=', 'files.parent_id')
        .execute();

      await trx
        .deleteFrom('files')
        .where('id', 'in', fileIdsToDelete)
        .execute();
    });
  }
}
