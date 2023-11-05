import { UserPassDto } from 'src/infraestructure/api-rest/dtos/user.dto';

export interface IUserService {
  createUser(user: UserPassDto);
}
