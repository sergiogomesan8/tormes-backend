import { User } from '../../models/user';

export interface IUserService {
  createUser(user: User);
}
