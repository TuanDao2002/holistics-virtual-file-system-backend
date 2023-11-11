import { Kysely } from 'kysely';
import { FileTable } from '../modules/file/entity/file.entity';
import { FolderTable } from '../modules/folder/entity/folder.entity';

interface Tables {
  files: FileTable;
  folders: FolderTable;
}

export class Database extends Kysely<Tables> {}
