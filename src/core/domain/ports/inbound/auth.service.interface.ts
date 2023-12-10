import { LoginUserDto } from '../../../../infraestructure/api-rest/dtos/auth.dto';
import { CreateUserDto } from '../../../../infraestructure/api-rest/dtos/user.dto';
import { AuthModel } from '../../models/auth.model';

export interface IAuthService {
  register(createUserDto: CreateUserDto): Promise<AuthModel>;
  login(loginUserDto: LoginUserDto): Promise<AuthModel>;
}
