import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entities/user.entity';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { AppModule } from '../src/app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { default as dbConfig } from './config/db';
import { Repository } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [dbConfig],
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get('db.host'),
            port: configService.get('db.port'),
            username: configService.get('db.username'),
            password: configService.get('db.password'),
            database: configService.get('db.name'),
            autoLoadEntities: true,
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AppModule,
      ],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
    repository = app.get(USER_REPOSITORY_TOKEN);
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
      const { body } = await request(app.getHttpServer())
        .post('/users')
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
      const userMock = { name: 'user 1' };
      const { body } = await request(app.getHttpServer())
        .post('/users')
        .send(userMock)
        .expect(400);
      const userRecords = await repository.query(`SELECT * FROM user;`);
      
      expect(body).toStrictEqual({
        message: 'create error: Field \'password\' doesn\'t have a default value', 
        statusCode: 400
      });
      expect(userRecords.length).toBe(0);
    }); 
  });

  describe('/ (GET)', () => {
    it('Should return an array of users', async () => {
      const usersMock = [
        { name: 'user 1', password: '123' },
        { name: 'user 2', password: '456' }
      ];
      await repository.save(usersMock)

      const { body } = await request(app.getHttpServer())
        .get('/users')
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
      const newUser = await repository.save(userMock)

      const { body } = await request(app.getHttpServer())
        .get(`/users/${newUser.id}`)
        .expect(200);

      expect(body.id).toBe(newUser.id);
      expect(body.name).toBe(userMock.name);
      expect(body.password).toBe(userMock.password);
    }); 

    it('When user ID doesn\'t exist, should return an empty body', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users/1')
        .expect(200);

        expect(body).toStrictEqual({});
    }); 
  });

  describe('/:id (PATCH)', () => {
    it('Should update and return updated user correctly', async () => {
      const userMock = { name: 'user 1', password: '123' };
      const updatedUserMock = { name: 'user 1 updated', password: '789' };
      const newUser = await repository.save(userMock);

      const { body } = await request(app.getHttpServer())
        .patch(`/users/${newUser.id}`)
        .send(updatedUserMock)
        .expect(200);

      expect(body.id).toBe(newUser.id);
      expect(body.name).toBe(updatedUserMock.name);
      expect(body.password).toBe(updatedUserMock.password);
    }); 

    it('When user ID doesn\'t exist, should return an update error', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/users/1')
        .expect(400);

        expect(body).toStrictEqual({
          message: 'update error: Error during update, item not found => id: 1',
          statusCode: 400,
        });
    }); 
  });

  describe('/:id (DELETE)', () => {
    it('Should delete and return deleted user correctly', async () => {
      const userMock = { name: 'user 1', password: '123' };
      const userToDelete = await repository.save(userMock);

      const { body } = await request(app.getHttpServer())
        .delete(`/users/${userToDelete.id}`)
        .expect(200);

      expect(body.id).toBe(undefined);
      expect(body.name).toBe(userMock.name);
      expect(body.password).toBe(userMock.password);
    }); 

    it('When user ID doesn\'t exist, should return an update error', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/users/1')
        .expect(400);

        expect(body).toStrictEqual({
          message: 'delete error: Error during remove, item not found => id: 1',
          statusCode: 400,
        });
    }); 
  });
});
