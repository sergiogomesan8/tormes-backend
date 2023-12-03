import {
  CreateUserDto,
  // LoginUserDto,
} from '../../../../infraestructure/api-rest/dtos/user.dto';

export interface IAuthService {
  register(createUserDto: CreateUserDto);
  // login(loginUserDto: LoginUserDto);
}
