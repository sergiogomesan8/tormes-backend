import { UserEntity } from '../../../../infraestructure/postgres/entities/user.entity';
import { CreateUserDto } from '../../../../infraestructure/api-rest/dtos/user.dto';

export interface IUserService {
  create(user: CreateUserDto): Promise<UserEntity | null>;
  // update(user: User): User;
  // delete(id: string): User;
  // findOneBy(id: string): Promise<UserEntity | null>;
  // findAll(): User[];
}
