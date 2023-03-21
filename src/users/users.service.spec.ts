import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
const userDataMock: User[] = [
  Object.assign(new User(), { id: 1, name: 'First user', password: '123' }),
  Object.assign(new User(), { id: 2, name: 'Second user', password: '456' }),
];

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useFactory: () => ({
            find: jest.fn(() => Promise.resolve(userDataMock)),
            findOneBy: jest.fn(() => Promise.resolve(userDataMock[0])),
            save: jest.fn(() => Promise.resolve(userDataMock[0])),
            remove: jest.fn(() => Promise.resolve(userDataMock[0])),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Repository<User> should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('when repository.save fails, should throw an error', async () => {
      jest.spyOn(repository, 'save').mockImplementationOnce(() => {
        throw new Error('Save error reason');
      });

      try {
        await service.create({
          name: 'New User',
          password: '789',
        } as CreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('create error: Save error reason');
      }
    });

    it('should call userRepository.save() correctly', async () => {
      jest.spyOn(repository, 'save');
      await service.create({ name: 'New User', password: '789' });

      expect(repository.save).toHaveBeenCalledWith({
        name: 'New User',
        password: '789',
      });
    });

    it('should return a record correctly', async () => {
      const result = await service.create({
        name: 'New User',
        password: '789',
      } as CreateUserDto);

      expect(result).toBe(userDataMock[0]);
    });
  });

  describe('findAll()', () => {
    it('Should call userRepository.find() correctly', async () => {
      await service.findAll();

      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne()', () => {
    it('Should call userRepository.findOneBy() correctly', async () => {
      jest.spyOn(repository, 'findOneBy');
      await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('Should return a record correctly', async () => {
      jest.spyOn(repository, 'findOneBy');
      const result = await service.findOne(1);

      expect(result).toBe(userDataMock[0]);
    });

    it("When record doesn't exists, should return an empty body", async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(undefined));
      const result = await service.findOne(1);

      expect(result).toBe(undefined);
    });
  });

  describe('findOneByName()', () => {
    it('Should call userRepository.findOneBy() correctly', async () => {
      jest.spyOn(repository, 'findOneBy');
      await service.findOneByName('First user');

      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'First user' });
    });

    it('Should return a record correctly', async () => {
      jest.spyOn(repository, 'findOneBy');
      const result = await service.findOneByName('First user');

      expect(result).toBe(userDataMock[0]);
    });

    it("When record doesn't exists, should return an empty body", async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(undefined));
      const result = await service.findOneByName('First user');

      expect(result).toBe(undefined);
    });
  });

  describe('update()', () => {
    it('when not id param, should throw an error.', async () => {
      const updateUserDtoMock: UpdateUserDto = { name: 'First user' };

      try {
        // @ts-ignore
        await service.update(undefined, updateUserDtoMock);
      } catch (error) {
        expect(error.message).toBe('update error: id is empty');
      }
    });

    it('should call userRepository.save() correctly.', async () => {
      const updateUserDtoMock: UpdateUserDto = { name: 'First user updated' };
      const repositoryCallParams = Object.assign(
        userDataMock[0],
        updateUserDtoMock,
      );
      jest.spyOn(repository, 'save');

      await service.update(1, updateUserDtoMock);

      expect(repository.save).toHaveBeenCalledWith(repositoryCallParams);
    });

    it('should return the updated record correctly.', async () => {
      const plantRecordMock: User = new User();
      const updateUserDtoMock: UpdateUserDto = { name: 'First user' };
      const updatedPlantRecordMock: User = Object.assign(
        plantRecordMock,
        updateUserDtoMock,
      );
      jest
        .spyOn(repository, 'save')
        .mockReturnValueOnce(Promise.resolve(updatedPlantRecordMock));

      const result = await service.update(1, updatedPlantRecordMock);

      expect(result).toBe(updatedPlantRecordMock);
    });

    it('when userRepository.save fails, should throw an error', async () => {
      jest.spyOn(repository, 'save').mockImplementationOnce(() => {
        throw new Error('Save error reason');
      });

      try {
        await service.update(1, new UpdateUserDto());
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('update error: Save error reason');
      }
    });
  });

  describe('delete()', () => {
    it('when not id param, should throw an error.', async () => {
      try {
        // @ts-ignore
        await service.remove();
      } catch (error) {
        expect(error.message).toBe('delete error: id is empty');
      }
    });

    it('should call userRepository.delete() correctly.', async () => {
      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(userDataMock[0]);
    });

    it('should return the updated record correctly.', async () => {
      const result: User | undefined = await service.remove(1);

      expect(result).toBe(userDataMock[0]);
    });

    it('when userRepository.delete fails, should throw an error', async () => {
      jest.spyOn(repository, 'findOneBy').mockImplementationOnce(() => {
        throw new Error('Delete error reason');
      });

      try {
        await service.remove(1);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('delete error: Delete error reason');
      }
    });
  });
});
