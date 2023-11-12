import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Database } from '../../../database/database';
import { Constant } from '../../../common/constant';
import extractPath from '../../../utility/extractPath';
import { UpdateResult } from 'kysely';
import { UpdateFolderDto } from '../dto/update-folder.dto';

@Injectable()
export class FolderRepository {
  constructor(private readonly database: Database) {}

  public async getFolder(folderPath: string): Promise<any> {
    if (folderPath == null) return null;
    const [folderName, parentPath] = extractPath(folderPath);

    if (!folderName.match(Constant.NAME_REGEX)) {
      throw new BadRequestException('Invalid folder name');
    }

    const folders = await this.database
      .selectFrom('folders')
      .selectAll()
      .where('name', '=', folderName)
      .where('path', parentPath === null ? 'is' : '=', parentPath)
      .execute();
    if (folders.length == 0) {
      return null;
    }

    return folders[0];
  }

  public async listFolder(path: string): Promise<any> {
    return await this.database.transaction().execute(async (trx) => {
      const existingFolder = await this.getFolder(path);
      if (!existingFolder) {
        throw new NotFoundException('Folder not exist');
      }

      const findSubFolders = trx
        .selectFrom('folders')
        .select(['name', 'created_at', 'size'])
        .where('parent_id', '=', existingFolder.id)
        .execute();

      const findFiles = trx
        .selectFrom('files')
        .select(['name', 'created_at', 'size'])
        .where('parent_id', '=', existingFolder.id)
        .execute();

      return (await Promise.all([findSubFolders, findFiles])).flat();
    });
  }

  public async createFolder(path: string): Promise<{
    id: number;
    name: string;
    path: string;
  }> {
    const [folderName, parentPath] = extractPath(path);
    if (!folderName.match(Constant.NAME_REGEX)) {
      throw new BadRequestException('Invalid folder name');
    }

    return await this.database.transaction().execute(async (trx) => {
      const parentFolder = await this.getFolder(parentPath);
      if (!parentFolder && parentPath) throw new NotFoundException('Parent folder not exist');

      const existingFolder = await this.getFolder(path);
      if (existingFolder) {
        throw new BadRequestException('Folder already exist');
      }

      return await trx
        .insertInto('folders')
        .values({
          name: folderName,
          parent_id: parentFolder === null ? null : parentFolder.id,
          path: parentFolder === null ? null : parentPath,
        })
        .returning(['id', 'name', 'path'])
        .executeTakeFirstOrThrow();
    });
  }

  public async updateFolder(
    id: number,
    updateData: UpdateFolderDto,
  ): Promise<UpdateResult> {
    return await this.database
      .updateTable('folders')
      .where('id', '=', id)
      .set(updateData)
      .executeTakeFirst();
  }
}
