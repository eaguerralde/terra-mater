import { Test, TestingModule } from '@nestjs/testing';
import { Request } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto, FindOneUserParamsDto, UpdateUserDto } from './dto/';
import { AuthRequest } from '../auth/types/auth-request.type';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';

const userDataMock: User[] = [
  Object.assign(new User(), { id: 1, name: 'First user', isAdmin: true }),
  Object.assign(new User(), { id: 2, name: 'Second user' }),
];
const serviceMock = (id) => Promise.resolve(userDataMock.find(user => user.id === id));

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let request: Request;
  let adminRequestMock: AuthRequest;
  let userRequestMock: AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            findAll: jest.fn(() => Promise.resolve(userDataMock)),
            findOne: jest.fn(serviceMock),
            create: jest.fn(() => Promise.resolve(userDataMock[0])),
            update: jest.fn(serviceMock),
            remove: jest.fn(serviceMock),
          }),
        },
        {
          provide: Request,
          useValue: {},
        },
        CaslAbilityFactory,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    request = module.get<Request>(Request);
    adminRequestMock = { ...request, ...{ user: userDataMock[0] } };
    userRequestMock = { ...request, ...{ user: userDataMock[1] } };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('UsersService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create correctly', async () => {
      const bodyMock: CreateUserDto = new CreateUserDto();
      await controller.create(bodyMock);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(bodyMock);
    });

    it('should return the newly created User correctly', async () => {
      const bodyMock: CreateUserDto = new CreateUserDto();
      const result: User = await controller.create(bodyMock);

      expect(result).toEqual(userDataMock[0]);
    });
  });

  describe('findAll', () => {
    it('should throw for standard users', async () => {
      await expect(async () => {
        await controller.findAll(userRequestMock);
      }).rejects.toThrow('Forbidden');
    });

    describe('when user is admin', () => {
      it('should call usersService.findAll correctly', async () => {
        await controller.findAll(adminRequestMock);

        expect(service.findAll).toHaveBeenCalledTimes(1);
        expect(service.findAll).toHaveBeenCalledWith();
      });

      it('should return an array with all User correctly', async () => {
        const result: User[] = await controller.findAll(adminRequestMock);

        expect(result).toEqual(userDataMock);
      });
    });
  });

  describe('findOne', () => {
    describe('when user is admin', () => {
      it('should call usersService.findOne correctly', async () => {
        await controller.findOne({ id: 1 }, adminRequestMock);

        expect(service.findOne).toHaveBeenCalledTimes(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
      });

      it('should return the found User correctly', async () => {
        const result = await controller.findOne({ id: 1 }, adminRequestMock);

        expect(result).toEqual(userDataMock[0]);
      });

      it("when user ID doesn't exist, should return undefined", async () => {
        const result = await controller.findOne({ id: 3 }, adminRequestMock);

        expect(result).toEqual(undefined);
      });
    });

    describe('when user is standard', () => {
      it('should call usersService.findOne correctly', async () => {
        await controller.findOne({ id: 2 }, userRequestMock);

        expect(service.findOne).toHaveBeenCalledTimes(1);
        expect(service.findOne).toHaveBeenCalledWith(2);
      });

      it('when user searched is different than current user, should throw Forbidden', async () => {
        await expect(async () => {
          await controller.findOne({ id: 1 }, userRequestMock);
        }).rejects.toThrow('Forbidden');
      });

      it('when user searched is the current user, should return the found User correctly', async () => {
        const result = await controller.findOne({ id: 2 }, userRequestMock);

        expect(result).toEqual(userDataMock[1]);
      });
    });
  });

  describe('update', () => {
    describe('when user is admin', () => {
      it('should call usersService.findAll correctly', async () => {
        const userDataUpdateMock: UpdateUserDto = new UpdateUserDto();
        const params: FindOneUserParamsDto = {
          ...new FindOneUserParamsDto(),
          id: 1,
        };
        await controller.update(params, userDataUpdateMock, adminRequestMock);

        expect(service.update).toHaveBeenCalledTimes(1);
        expect(service.update).toHaveBeenCalledWith(1, userDataUpdateMock);
      });

      it('should return the updated User correctly', async () => {
        const userDataUpdateMock: UpdateUserDto = new UpdateUserDto();
        const params: FindOneUserParamsDto = {
          ...new FindOneUserParamsDto(),
          id: 1,
        };
        const result: User = await controller.update(
          params,
          userDataUpdateMock,
          adminRequestMock,
        );

        expect(result).toEqual(userDataMock[0]);
      });

      it('when the updated user is different than the current, should return the updated User correctly', async () => {
        const userDataUpdateMock: UpdateUserDto = new UpdateUserDto();
        const params: FindOneUserParamsDto = {
          ...new FindOneUserParamsDto(),
          id: 2,
        };
        const result: User = await controller.update(
          params,
          userDataUpdateMock,
          adminRequestMock,
        );

        expect(result).toEqual(userDataMock[1]);
      });
    });

    describe('when user is standard', () => {
      it('should call usersService.findAll correctly', async () => {
        const userDataUpdateMock: UpdateUserDto = new UpdateUserDto();
        const params: FindOneUserParamsDto = {
          ...new FindOneUserParamsDto(),
          id: 2,
        };
        await controller.update(params, userDataUpdateMock, userRequestMock);

        expect(service.update).toHaveBeenCalledTimes(1);
        expect(service.update).toHaveBeenCalledWith(2, userDataUpdateMock);
      });

      it('should return the updated User correctly', async () => {
        const userDataUpdateMock: UpdateUserDto = new UpdateUserDto();
        const params: FindOneUserParamsDto = {
          ...new FindOneUserParamsDto(),
          id: 2,
        };
        // jest.spyOn(service, 'update').mockResolvedValueOnce(userDataMock[1]);
        const result: User = await controller.update(
          params,
          userDataUpdateMock,
          userRequestMock,
        );

        expect(result).toEqual(userDataMock[1]);
      });

      it('when the updated user is different than the current, should throw Forbiden error', async () => {
        const userDataUpdateMock: UpdateUserDto = new UpdateUserDto();
        const params: FindOneUserParamsDto = {
          ...new FindOneUserParamsDto(),
          id: 1,
        };

        await expect(async () => {
          await controller.update(params, userDataUpdateMock, userRequestMock);
        }).rejects.toThrow('Forbidden');
      });
    });
  });

  describe('delete', () => {
    describe('when user is admin', () => {
      it('should call usersService.remove correctly', async () => {
        await controller.remove({ id: 1 }, adminRequestMock);

        expect(service.remove).toHaveBeenCalledTimes(1);
        expect(service.remove).toHaveBeenCalledWith(1);
      });

      it('should return the deleted User correctly', async () => {
        const result: User = await controller.remove(
          { id: 1 },
          adminRequestMock,
        );

        expect(result).toEqual(userDataMock[0]);
      });

      it('when deleted user is different than current, should return the deleted User correctly', async () => {
        const result: User = await controller.remove(
          { id: 2 },
          adminRequestMock,
        );

        expect(result).toEqual(userDataMock[1]);
      });
    });

    describe('when user is standard', () => {
      it('should call usersService.remove correctly', async () => {
        await controller.remove({ id: 2 }, userRequestMock);

        expect(service.remove).toHaveBeenCalledTimes(1);
        expect(service.remove).toHaveBeenCalledWith(2);
      });

      it('should return the deleted User correctly', async () => {
        const result: User = await controller.remove(
          { id: 2 },
          userRequestMock,
        );

        expect(result).toEqual(userDataMock[1]);
      });

      it('when the deleted user is different than the current, should throw Forbiden error', async () => {
        await expect(async () => {
          await controller.remove({ id: 0 }, userRequestMock);
        }).rejects.toThrow('Forbidden');
      });
    });
  });
});
