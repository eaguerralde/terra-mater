import { User } from '../../users/entities/user.entity';

export type AuthUser = Omit<User, 'password' | 'updateTimestamp'>;
