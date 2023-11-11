import { Injectable, NotFoundException } from '@nestjs/common';
import { Database } from '../../../database/database';

@Injectable()
export class FileRepository {
  constructor(private readonly database: Database) {}

  public async getFileContent(
    filename: string,
    path: string = null,
  ): Promise<string> {
    const files = await this.database
      .selectFrom('files')
      .select('data')
      .where('name', '=', filename)
      .where('path', path === null ? 'is' : '=', path)
      .execute();
    if (files.length == 0) {
      throw new NotFoundException('File not exist');
    }

    return files[0].data;
  }
}
