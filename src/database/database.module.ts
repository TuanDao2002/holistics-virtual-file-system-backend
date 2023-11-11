import { Global, Module } from '@nestjs/common';
import { Database } from './database';
import {
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
} from './database.module-definition';
import { DatabaseOptions } from './databaseOptions';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

@Global()
@Module({
  exports: [Database],
  providers: [
    {
      provide: Database,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: databaseOptions.host,
            port: databaseOptions.port,
            user: databaseOptions.user,
            password: databaseOptions.password,
            database: databaseOptions.database,
            ssl: true,
          }),
        });

        return new Database({
          dialect,
          log(event) {
            if (event.level === 'query') {
              console.log(event.query.sql);
              console.log(event.query.parameters);
            }
          },
        });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
