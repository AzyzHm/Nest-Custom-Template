import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { TaskEntity } from '../../src/modules/tasks/entities/task.entity';
import { TasksModule } from '../../src/modules/tasks/tasks.module';
import { InMemoryDatabaseModule } from '../utils/in-memory-database.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InMemoryDatabaseModule, TypeOrmModule.forFeature([TaskEntity]), TasksModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /tasks creates a task', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Ship the template' })
      .expect(201);

    expect(response.body).toMatchObject({ title: 'Ship the template', status: 'pending' });
    expect(response.body.id).toBeDefined();
  });

  it('POST /tasks rejects a missing title', async () => {
    await request(app.getHttpServer()).post('/tasks').send({}).expect(400);
  });

  it('GET /tasks returns a paginated list', async () => {
    await request(app.getHttpServer()).post('/tasks').send({ title: 'Another task' });

    const response = await request(app.getHttpServer()).get('/tasks').expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('total');
  });

  it('GET /tasks/:id returns 404 for an unknown task', async () => {
    await request(app.getHttpServer())
      .get('/tasks/11111111-1111-1111-1111-111111111111')
      .expect(404);
  });

  it('supports the full create -> read -> update -> delete lifecycle', async () => {
    const created = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Lifecycle task' })
      .expect(201);

    const id: string = created.body.id;

    await request(app.getHttpServer()).get(`/tasks/${id}`).expect(200);

    await request(app.getHttpServer())
      .patch(`/tasks/${id}`)
      .send({ status: 'done' })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('done');
      });

    await request(app.getHttpServer()).delete(`/tasks/${id}`).expect(204);

    await request(app.getHttpServer()).get(`/tasks/${id}`).expect(404);
  });
});
