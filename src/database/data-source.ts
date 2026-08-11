import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { TaskEntity } from '../modules/tasks/entities/task.entity';

config();

/**
 * Used exclusively by the TypeORM CLI (`npm run migration:generate` /
 * `migration:run`), which cannot consume Nest's dependency injection
 * container. Kept in sync manually with database.module.ts.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? '',
  database: process.env.DATABASE_NAME ?? 'nest_template',
  entities: [TaskEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
