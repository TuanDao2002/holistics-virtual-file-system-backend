import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Database } from '../../../database/database';
import { Constant } from '../../../common/constant';
import extractPath from '../../../utility/extractPath';

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
}
