import { UserDto } from 'src/infraestructure/api-rest/dtos/user.dto';
import { User } from '../../models/user';

export interface UserRepository {
  createUser(user: User): Promise<UserDto>;
}

export const UserRepository = Symbol('UserRepository');
