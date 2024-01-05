import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../models/user.model';

export const USER_TYPES_KEY = 'userTypes';
export const UserTypes = (...userType: UserType[]) =>
  SetMetadata(USER_TYPES_KEY, userType);
