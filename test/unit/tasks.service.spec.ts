import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '../../src/common/exceptions/resource-not-found.exception';
import { TaskEntity, TaskStatus } from '../../src/modules/tasks/entities/task.entity';
import { TasksRepository } from '../../src/modules/tasks/tasks.repository';
import { TasksService } from '../../src/modules/tasks/tasks.service';

describe('TasksService (unit)', () => {
  let service: TasksService;
  let repository: jest.Mocked<TasksRepository>;

  const buildTask = (overrides: Partial<TaskEntity> = {}): TaskEntity => ({
    id: 'a3b1f6d0-1111-4b22-9999-abcdef123456',
    title: 'Write tests',
    description: null,
    status: TaskStatus.PENDING,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            remove: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(TasksService);
    repository = module.get(TasksRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates and persists a task, returning the mapped response DTO', async () => {
      const entity = buildTask();
      repository.create.mockReturnValue(entity);
      repository.save.mockResolvedValue(entity);

      const result = await service.create({ title: 'Write tests' });

      expect(repository.create).toHaveBeenCalledWith({ title: 'Write tests' });
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual({
        id: entity.id,
        title: entity.title,
        description: entity.description,
        status: entity.status,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      });
    });
  });

  describe('findAll', () => {
    it('returns paginated results using the requested page and limit', async () => {
      const entities = [buildTask(), buildTask({ id: 'b4c2a7e1-2222-4b22-9999-abcdef654321' })];
      repository.findAll.mockResolvedValue([entities, 2]);

      const result = await service.findAll(1, 20);

      expect(repository.findAll).toHaveBeenCalledWith(0, 20);
      expect(result.total).toBe(2);
      expect(result.data).toHaveLength(2);
    });

    it('computes the correct offset for pages beyond the first', async () => {
      repository.findAll.mockResolvedValue([[], 0]);

      await service.findAll(3, 10);

      expect(repository.findAll).toHaveBeenCalledWith(20, 10);
    });
  });

  describe('findOne', () => {
    it('returns the mapped task when found', async () => {
      const entity = buildTask();
      repository.findById.mockResolvedValue(entity);

      const result = await service.findOne(entity.id);

      expect(result.id).toBe(entity.id);
    });

    it('throws ResourceNotFoundException when the task does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
        ResourceNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('merges changes onto the existing entity and saves it', async () => {
      const entity = buildTask();
      const merged = buildTask({ title: 'Updated title' });
      repository.findById.mockResolvedValue(entity);
      repository.merge.mockReturnValue(merged);
      repository.save.mockResolvedValue(merged);

      const result = await service.update(entity.id, { title: 'Updated title' });

      expect(repository.merge).toHaveBeenCalledWith(entity, { title: 'Updated title' });
      expect(result.title).toBe('Updated title');
    });

    it('throws ResourceNotFoundException when updating a missing task', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('missing-id', { title: 'x' })).rejects.toBeInstanceOf(
        ResourceNotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('removes the entity when it exists', async () => {
      const entity = buildTask();
      repository.findById.mockResolvedValue(entity);

      await service.remove(entity.id);

      expect(repository.remove).toHaveBeenCalledWith(entity);
    });

    it('throws ResourceNotFoundException when removing a missing task', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toBeInstanceOf(
        ResourceNotFoundException,
      );
    });
  });
});
