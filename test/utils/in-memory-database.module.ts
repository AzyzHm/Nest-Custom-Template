import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from '../../src/modules/tasks/entities/task.entity';

/**
 * A fresh, isolated in-memory SQLite connection - no external Postgres
 * instance required to run integration or e2e tests. Every call returns a
 * module targeting a brand-new ":memory:" database, so tests don't leak
 * state into one another across test files.
 */
export const InMemoryDatabaseModule = TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  entities: [TaskEntity],
  synchronize: true,
  logging: false,
});
