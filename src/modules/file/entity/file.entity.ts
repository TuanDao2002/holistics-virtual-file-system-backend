import { ColumnType, Generated } from 'kysely';

export interface FileTable {
  id: Generated<number>;
  name: string;
  data: string | null;
  size: number | 0;
  parent_id: number | null;
  created_at: ColumnType<Date, string | undefined, never>;
}
