import { CreateUserDto } from '../../../../infraestructure/api-rest/dtos/user.dto';
import { User } from '../../models/user.model';

export interface IUserService {
  createUser(user: CreateUserDto): Promise<User>;
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
}
