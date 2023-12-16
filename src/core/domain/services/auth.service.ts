import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthService } from '../ports/inbound/auth.service.interface';
import { JwtPayload } from './jwt-config/jwt-playload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { UserService } from './user.service';
import { AuthModel } from '../models/auth.model';
import { LoginUserDto } from '../../../infraestructure/api-rest/dtos/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
  static SALT_ROUNDS: number = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthModel> {
    try {
      const { password } = createUserDto;
      const hashedPassword = bcrypt.hashSync(password, AuthService.SALT_ROUNDS);
      const user = await this.userService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const token = this.getJwtToken({ email: user.email });

      return {
        user_info: user,
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthModel> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userService.findOneByEmail(email);

      if (!user) throw new UnauthorizedException('Credential are not valid.');
      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credential are not valid.');

      return {
        user_info: user,
        token: this.getJwtToken({ email: email }),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error logging user');
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
