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

    const folder = await this.database
      .selectFrom('folders')
      .selectAll()
      .where('name', '=', folderName)
      .where('path', parentPath === null ? 'is' : '=', parentPath)
      .executeTakeFirst();
    if (!folder) {
      return null;
    }

    return folder;
  }

  public async listFolder(path: string | null): Promise<any> {
    return await this.database.transaction().execute(async (trx) => {
      let existingFolderId = null;
      if (path != null) {
        const existingFolder = await this.getFolder(path);
        if (!existingFolder) {
          throw new NotFoundException('Folder not exist');
        }

        existingFolderId = existingFolder.id;
      }

      const findSubFolders = trx
        .selectFrom('folders')
        .select(['name', 'created_at', 'size'])
        .where('parent_id', !existingFolderId ? 'is' : '=', existingFolderId)
        .execute();

      const findFiles = trx
        .selectFrom('files')
        .select(['name', 'created_at', 'size'])
        .where('parent_id', !existingFolderId ? 'is' : '=', existingFolderId)
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
      if (!parentFolder && parentPath)
        throw new NotFoundException('Parent folder not exist');

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

  public async removeFolders(paths: string[]): Promise<void> {
    let checkFolderPaths = [];
    paths.forEach((path) => {
      checkFolderPaths.push(this.getFolder(path));
    });
    const validFolders = await Promise.all(checkFolderPaths);
    let folderIdsToDelete: number[] = [];
    validFolders.forEach((folder) => {
      if (folder != null) {
        folderIdsToDelete.push(folder.id);
      }
    });

    if (folderIdsToDelete.length == 0) return;

    return await this.database.transaction().execute(async (trx) => {
      await trx
        .deleteFrom('folders')
        .where('id', 'in', folderIdsToDelete)
        .execute();
    });
  }
}
