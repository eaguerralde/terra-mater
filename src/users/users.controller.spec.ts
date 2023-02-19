import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UpdateUserParamsDto } from './dto/';

const userDataMock: User[] = [
  Object.assign(new User(), { id: 1, name: 'First user' }),
  Object.assign(new User(), { id: 2, name: 'Second user' }),
];

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            findAll: jest.fn(() => Promise.resolve(userDataMock)),
            findOne: jest.fn(() => Promise.resolve(userDataMock[0])),
            create: jest.fn(() => Promise.resolve(userDataMock[0])),
            update: jest.fn(() => Promise.resolve(userDataMock[0])),
            remove: jest.fn(() => Promise.resolve(userDataMock[0])),
          }),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('UsersService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.findAll correctly', async () => {
      const bodyMock: CreateUserDto = new CreateUserDto();
      await controller.create(bodyMock);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(bodyMock);
    });

    it('should return the newly created User correctly', async () => {
      const bodyMock: CreateUserDto = new CreateUserDto();
      jest.spyOn(service, 'create');

      const result: User | undefined = await controller.create(bodyMock);

      expect(result).toEqual(userDataMock[0]);
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll correctly', async () => {
      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an array with all User correctly', async () => {
      const result: User[] = await controller.findAll();

      expect(result).toEqual(userDataMock);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findAll correctly', async () => {
      await controller.findOne({ id: 1 });

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should return the found User correctly', async () => {
      const result = await controller.findOne({ id: 1 });

      expect(result).toEqual(userDataMock[0]);
    });

    it("when user ID doesn't exist, should return undefined", async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(undefined);
      const result = await controller.findOne({ id: 3 });

      expect(result).toEqual(undefined);
    });
  });

  describe('update', () => {
    it('should call usersService.findAll correctly', async () => {
      const userDataUpdateMock: UpdateUserDto = new UpdateUserDto();
      await controller.update('1', userDataUpdateMock);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, userDataUpdateMock);
    });

    it('should return the updated User correctly', async () => {
      const userDataUpdateMock: UpdateUserDto = new UpdateUserDto();
      const result: User | undefined = await controller.update(
        '1',
        userDataUpdateMock,
      );

      expect(result).toEqual(userDataMock[0]);
    });
  });

  describe('delete', () => {
    it('should call usersService.delete correctly', async () => {
      await controller.remove({ id: 1 });

      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should return the deleted User correctly', async () => {
      const result: User | undefined = await controller.remove({ id: 1 });

      expect(result).toEqual(userDataMock[0]);
    });
  });
});
