import { ColumnType, Generated } from 'kysely';

export interface FolderTable {
  id: Generated<number>;
  name: string;
  parent_id: number | null;
  size: number | 0;
  path: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}
