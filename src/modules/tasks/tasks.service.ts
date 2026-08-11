import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '../../common/exceptions/resource-not-found.exception';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMapper } from './mappers/task.mapper';
import { TasksRepository } from './tasks.repository';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Business logic lives here, above the repository. Anything beyond plain
 * CRUD (validation rules, side effects, orchestration across repositories)
 * belongs in this layer, not in the controller.
 */
@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(dto: CreateTaskDto): Promise<TaskResponseDto> {
    const entity = this.tasksRepository.create(dto);
    const saved = await this.tasksRepository.save(entity);
    return TaskMapper.toResponseDto(saved);
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<TaskResponseDto>> {
    const skip = (page - 1) * limit;
    const [entities, total] = await this.tasksRepository.findAll(skip, limit);

    return {
      data: TaskMapper.toResponseDtoList(entities),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<TaskResponseDto> {
    const entity = await this.getEntityOrThrow(id);
    return TaskMapper.toResponseDto(entity);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    const entity = await this.getEntityOrThrow(id);
    const merged = this.tasksRepository.merge(entity, dto);
    const saved = await this.tasksRepository.save(merged);
    return TaskMapper.toResponseDto(saved);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.getEntityOrThrow(id);
    await this.tasksRepository.remove(entity);
  }

  private async getEntityOrThrow(id: string) {
    const entity = await this.tasksRepository.findById(id);
    if (!entity) {
      throw new ResourceNotFoundException('Task', id);
    }
    return entity;
  }
}
