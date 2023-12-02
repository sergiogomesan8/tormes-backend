import { UserEntity } from 'src/infraestructure/postgres/entities/user.entity';
import { User } from '../../models/user.model';
import { CreateUserDto } from 'src/infraestructure/api-rest/dtos/user.dto';

export interface IUserService {
  create(user: CreateUserDto): Promise<UserEntity | null>;
  update(user: User): User;
  delete(id: string): User;
  findOneBy(id: string): Promise<UserEntity | null>;
  findAll(): User[];
}
