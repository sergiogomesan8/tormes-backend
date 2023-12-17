import { CreateUserDto } from '../../../../infraestructure/api-rest/dtos/user.dto';
import { User } from '../../models/user.model';

export interface IUserService {
  createUser(user: CreateUserDto): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  // update(user: User): User;
  // delete(id: string): User;
  // findOneBy(id: string): Promise<UserEntity | null>;
  // findAll(): User[];
}
