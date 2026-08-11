import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

/**
 * Data-access layer. Services depend on this instead of talking to
 * @InjectRepository directly, which keeps ORM/query concerns isolated and
 * makes the service layer trivial to unit test with a mocked repository.
 */
@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}

  create(dto: CreateTaskDto): TaskEntity {
    return this.repository.create(dto);
  }

  save(entity: TaskEntity): Promise<TaskEntity> {
    return this.repository.save(entity);
  }

  findAll(skip: number, take: number): Promise<[TaskEntity[], number]> {
    return this.repository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<TaskEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async remove(entity: TaskEntity): Promise<void> {
    await this.repository.remove(entity);
  }

  merge(entity: TaskEntity, dto: UpdateTaskDto): TaskEntity {
    return this.repository.merge(entity, dto);
  }
}