import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from '../modules/tasks/entities/task.entity';

/**
 * Wires TypeORM to the app's PostgreSQL config. Entities are listed
 * explicitly (rather than a glob) so the connection stays predictable as
 * the project grows - add new entities to this array alongside new modules.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [TaskEntity],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
