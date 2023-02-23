import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AuthUser } from './types/auth-user.type';
import { UsersService } from '../users/users.service';
import { AuthToken } from './types/auth-token.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  getToken(user: AuthUser): AuthToken {
    return {
      access_token: this.jwtService.sign({
        name: user.name,
        id: user.id,
      }),
    };
  }
}
