import { Type } from 'class-transformer';
import { SerializedUser, User } from './user.model';

export interface AuthModel {
  user_info: User;
  token: string;
}

export class SerializedAuthModel {
  @Type(() => SerializedUser)
  user_info: SerializedUser;

  token: string;

  constructor(partial: Partial<SerializedAuthModel>) {
    Object.assign(this, partial);
  }
}
