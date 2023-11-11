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
      throw new BadRequestException('Invalid file name');
    }

    const files = await this.database
      .selectFrom('files')
      .selectAll()
      .where('name', '=', fileName)
      .where('path', parentPath === null ? 'is' : '=', parentPath)
      .execute();
    if (files.length == 0) {
      return null;
    }

    return files[0];
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
      console.log(
        '🚀 ~ file: file.repository.ts:60 ~ FileRepository ~ returnawaitthis.database.transaction ~ parentFolder:',
        parentFolder,
      );
      if (!parentFolder) throw new NotFoundException('Parent folder not exist');

      const existingFile = await this.getFile(path);
      if (existingFile) {
        throw new BadRequestException('File already exist');
      }

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
}
