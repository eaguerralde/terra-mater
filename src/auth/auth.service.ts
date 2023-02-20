import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { AuthUser } from './types/auth-user.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user: User = await this.usersService.findOneByName(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
