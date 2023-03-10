import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthToken } from './types/auth-token.type';
import { PublicRoute } from '../common/decorators/public-route.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): AuthToken {
    return this.authService.getToken(req.user);
  }
}
