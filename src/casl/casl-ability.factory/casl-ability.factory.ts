import {
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  MongoAbility,
  ExtractSubjectType,
  PureAbility,
  MongoQuery,
  Ability,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Actions } from '../enums/actions.enum';
import { User } from '../../users/entities/user.entity';

type Subjects = InferSubjects<typeof User | 'all'>;

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Actions, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      // admins can manage all Users
      can(Actions.Manage, 'all');
    } else {
      // non-admins can manage own User
      can(Actions.Manage, User, { id: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
