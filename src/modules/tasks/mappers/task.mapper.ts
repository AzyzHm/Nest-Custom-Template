import { TaskEntity } from '../entities/task.entity';
import { TaskResponseDto } from '../dto/task-response.dto';

/**
 * Pure translation functions between the persistence model and the wire
 * format. Keeping this separate means services never leak ORM entities to
 * controllers, and controllers never need to know how a Task is stored.
 */
export class TaskMapper {
  static toResponseDto(entity: TaskEntity): TaskResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseDtoList(entities: TaskEntity[]): TaskResponseDto[] {
    return entities.map((entity) => TaskMapper.toResponseDto(entity));
  }
}
