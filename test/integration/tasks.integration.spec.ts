import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourceNotFoundException } from '../../src/common/exceptions/resource-not-found.exception';
import { TaskEntity, TaskStatus } from '../../src/modules/tasks/entities/task.entity';
import { TasksRepository } from '../../src/modules/tasks/tasks.repository';
import { TasksService } from '../../src/modules/tasks/tasks.service';
import { InMemoryDatabaseModule } from '../utils/in-memory-database.module';

describe('Tasks module (integration)', () => {
  let module: TestingModule;
  let service: TasksService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [InMemoryDatabaseModule, TypeOrmModule.forFeature([TaskEntity])],
      providers: [TasksService, TasksRepository],
    }).compile();

    service = module.get(TasksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('persists a created task and retrieves it by id', async () => {
    const created = await service.create({ title: 'Integration task' });

    const found = await service.findOne(created.id);

    expect(found).toEqual(created);
    expect(found.status).toBe(TaskStatus.PENDING);
  });

  it('lists tasks with pagination and total count', async () => {
    await service.create({ title: 'Task A' });
    await service.create({ title: 'Task B' });

    const page = await service.findAll(1, 1);

    expect(page.data).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.limit).toBe(1);
  });

  it('updates an existing task', async () => {
    const created = await service.create({ title: 'Original title' });

    const updated = await service.update(created.id, { title: 'New title' });

    expect(updated.title).toBe('New title');
    expect(updated.id).toBe(created.id);
  });

  it('deletes a task so it can no longer be found', async () => {
    const created = await service.create({ title: 'Ephemeral task' });

    await service.remove(created.id);

    await expect(service.findOne(created.id)).rejects.toBeInstanceOf(ResourceNotFoundException);
  });

  it('throws when updating a task that does not exist', async () => {
    await expect(
      service.update('11111111-1111-1111-1111-111111111111', { title: 'x' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException);
  });
});
