import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/users/entities/user.entity';
import { testingAppModuleFactory } from '../helpers/app-fixture';

const loginUser = async (app, username, password) => {
  const { body } = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ username, password })
    .expect(201);
  return body;
};

describe('UsersModule', () => {
  const routePrefix = '/users';
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

  describe('/ (POST)', () => {
    it('Should create and return a user', async () => {
      const userMock = { name: 'user 1', password: '123' };
      await repository.save(userMock);
      const loginResponse = await loginUser(
        app,
        userMock.name,
        userMock.password,
      );
      const { body } = await request(app.getHttpServer())
        .post(routePrefix)
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .send(userMock)
        .expect(201);
      const userRecords = await repository.query(`SELECT * FROM user;`);

      expect(body.name).toBe(userMock.name);
      expect(body.password).toBe(userMock.password);
      expect(userRecords.length).toBe(1);
      expect(userRecords[0].name).toBe(userMock.name);
      expect(userRecords[0].password).toBe(userMock.password);
    });

    it('when using wrong payload, should return an error', async () => {
      const userDummy = { name: 'user 1', password: '123' };
      await repository.save(userDummy);
      const loginResponse = await loginUser(
        app,
        userDummy.name,
        userDummy.password,
      );
      const userMock = { name: 'user 1' };
      const { body } = await request(app.getHttpServer())
        .post(routePrefix)
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .send(userMock)
        .expect(400);
      const userRecords = await repository.query(`SELECT * FROM user;`);

      expect(body).toStrictEqual({
        message: "create error: Field 'password' doesn't have a default value",
        statusCode: 400,
      });
      expect(userRecords.length).toBe(1);
    });
  });

  describe('/ (GET)', () => {
    it('Should return an array of users', async () => {
      const usersMock = [
        { name: 'user 1', password: '123' },
        { name: 'user 2', password: '456' },
      ];
      await repository.save(usersMock);
      const loginResponse = await loginUser(
        app,
        usersMock[0].name,
        usersMock[0].password,
      );
      const { body } = await request(app.getHttpServer())
        .get(routePrefix)
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .expect(200);

      expect(body.length).toBe(2);
      expect(body[0].name).toBe(usersMock[0].name);
      expect(body[0].password).toBe(usersMock[0].password);
      expect(body[1].name).toBe(usersMock[1].name);
      expect(body[1].password).toBe(usersMock[1].password);
    });
  });

  describe('/:id (GET)', () => {
    it('Should return the correct user', async () => {
      const userMock = { name: 'user 1', password: '123' };
      const newUser = await repository.save(userMock);
      const loginResponse = await loginUser(
        app,
        userMock.name,
        userMock.password,
      );
      const { body } = await request(app.getHttpServer())
        .get(`${routePrefix}/${newUser.id}`)
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .expect(200);

      expect(body.id).toBe(newUser.id);
      expect(body.name).toBe(userMock.name);
      expect(body.password).toBe(userMock.password);
    });

    it("When user ID doesn't exist, should return an empty body", async () => {
      const userMock = { name: 'user 1', password: '123' };
      await repository.save(userMock);
      const loginResponse = await loginUser(
        app,
        userMock.name,
        userMock.password,
      );
      const { body } = await request(app.getHttpServer())
        .get(routePrefix + '/0')
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .expect(200);

      expect(body).toStrictEqual({});
    });
  });

  describe('/:id (PATCH)', () => {
    it('Should update and return updated user correctly', async () => {
      const userMock = { name: 'user 1', password: '123' };
      const updatedUserMock = { name: 'user 1 updated', password: '789' };
      const newUser = await repository.save(userMock);
      const loginResponse = await loginUser(
        app,
        userMock.name,
        userMock.password,
      );
      const { body } = await request(app.getHttpServer())
        .patch(`${routePrefix}/${newUser.id}`)
        .send(updatedUserMock)
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .expect(200);

      expect(body.id).toBe(newUser.id);
      expect(body.name).toBe(updatedUserMock.name);
      expect(body.password).toBe(updatedUserMock.password);
    });

    it("When user ID doesn't exist, should return an update error", async () => {
      const dummyUser = { name: 'user 1', password: '123' };
      await repository.save(dummyUser);
      const loginResponse = await loginUser(
        app,
        dummyUser.name,
        dummyUser.password,
      );
      const { body } = await request(app.getHttpServer())
        .patch('/users/0')
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .expect(400);
      expect(body).toStrictEqual({
        message: 'update error: Error during update, item not found => id: 0',
        statusCode: 400,
      });
    });
  });

  describe('/:id (DELETE)', () => {
    it('Should delete and return deleted user correctly', async () => {
      const userMock = { name: 'user 1', password: '123' };
      const userToDelete = await repository.save(userMock);
      const loginResponse = await loginUser(
        app,
        userMock.name,
        userMock.password,
      );
      const { body } = await request(app.getHttpServer())
        .delete(`${routePrefix}/${userToDelete.id}`)
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .expect(200);
      expect(body.id).toBe(undefined);
      expect(body.name).toBe(userMock.name);
      expect(body.password).toBe(userMock.password);
    });

    it("When user ID doesn't exist, should return an update error", async () => {
      const dummyUser = { name: 'user 1', password: '123' };
      await repository.save(dummyUser);
      const loginResponse = await loginUser(
        app,
        dummyUser.name,
        dummyUser.password,
      );
      const { body } = await request(app.getHttpServer())
        .delete(routePrefix + '/0')
        .set('Authorization', 'Bearer ' + loginResponse.access_token)
        .expect(400);

      expect(body).toStrictEqual({
        message: 'delete error: Error during remove, item not found => id: 0',
        statusCode: 400,
      });
    });
  });
});
