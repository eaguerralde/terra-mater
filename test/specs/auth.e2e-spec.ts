import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/users/entities/user.entity';
import { testingAppModuleFactory } from '../helpers/app-fixture';

describe('AuthModule', () => {
  const routePrefix = '/auth';
  let app: INestApplication;
  let repository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await testingAppModuleFactory();
    app = moduleFixture.createNestApplication();
    await app.init();
    repository = app.get(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM user;`);
  });

  describe('/login (POST)', () => {
    it('should login and return a user', async () => {
      const userDataMock = { name: 'login user', password: '123' };
      const loginDataMock = { ...userDataMock, username: userDataMock.name };
      const userRecord = await repository.save(userDataMock);
      const { body } = await request(app.getHttpServer())
        .post(routePrefix + '/login')
        .send(loginDataMock)
        .expect(201);
      expect(typeof body.access_token).toBe('string');
    });

    it('when using wrong credentials, should login and return a user', async () => {
      const userDataMock = { name: 'login user', password: '123' };
      const loginDataMock = {
        username: userDataMock.name,
        password: 'wrong password',
      };
      await repository.save(userDataMock);
      const { body } = await request(app.getHttpServer())
        .post(routePrefix + '/login')
        .send(loginDataMock)
        .expect(401);
      expect(body).toStrictEqual({ message: 'Unauthorized', statusCode: 401 });
    });
  });
});
