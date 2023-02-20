import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

const userDataMock: User[] = [
  Object.assign(new User(), { id: 1, name: 'First user', password: '123' }),
  Object.assign(new User(), { id: 2, name: 'Second user', password: '456' }),
];

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useFactory: () => ({
            findAll: jest.fn(() => Promise.resolve(userDataMock)),
            findOne: jest.fn(() => Promise.resolve(userDataMock[0])),
            findOneByName: jest.fn(() => Promise.resolve(userDataMock[0])),
            create: jest.fn(() => Promise.resolve(userDataMock[0])),
            update: jest.fn(() => Promise.resolve(userDataMock[0])),
            remove: jest.fn(() => Promise.resolve(userDataMock[0])),
          }),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should have UsersService defined', () => {
    expect(userService).toBeDefined();
  });

  describe('validateUser()', () => {
    it('should call UsersService with the correct params', async () => {
      jest.spyOn(userService, 'findOneByName');
      await authService.validateUser('someusername', 'somepassword');
      expect(userService.findOneByName).toHaveBeenCalledWith('someusername');
    });

    it('when using wrong credentials, should not login and return null', async () => {
      const result = await authService.validateUser(
        'someusername',
        'somepassword',
      );
      expect(result).toBe(null);
    });

    it('when using valid credentials, should login and return the user entity without the password', async () => {
      const loginUser = userDataMock[0];
      const { password, ...loginUserResult } = loginUser;
      const result = await authService.validateUser(
        loginUser.name,
        loginUser.password,
      );
      expect(result).toStrictEqual(loginUserResult);
    });
  });
});
