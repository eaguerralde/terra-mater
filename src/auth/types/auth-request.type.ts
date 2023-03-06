import { User } from '../../users/entities/user.entity';
import { Request } from '@nestjs/common';

export type AuthRequest = Request & { user: User };
