import { NotFoundException } from '@nestjs/common';

/**
 * Thrown by services when a requested resource cannot be located.
 * Kept as a thin, named subclass (rather than throwing NotFoundException
 * directly from services) so call sites stay expressive and consistent.
 */
export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, identifier: string | number) {
    super(`${resource} with identifier "${identifier}" was not found.`);
  }
}
