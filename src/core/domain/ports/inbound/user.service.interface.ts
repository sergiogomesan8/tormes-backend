import { CreateUserDto } from '../../../../infraestructure/api-rest/dtos/user.dto';
import { User } from '../../models/user.model';

export interface IUserService {
  create(user: CreateUserDto): Promise<User>;
  // update(user: User): User;
  // delete(id: string): User;
  // findOneBy(id: string): Promise<UserEntity | null>;
  // findAll(): User[];
}
