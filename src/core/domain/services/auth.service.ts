import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from '../ports/inbound/auth.service.interface';
import { JwtPayload } from './jwt-config/jwt-playload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { UserService } from './user.service';
import { AuthModel } from '../models/auth.model';
import { LoginUserDto } from 'src/infraestructure/api-rest/dtos/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthModel> {
    try {
      const { password } = createUserDto;
      const hashedPassword = bcrypt.hashSync(password, 10);
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
      throw new Error(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthModel> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userService.findOne(loginUserDto);

      if (!user)
        throw new UnauthorizedException('Credential are not valid (email)');
      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credential are not valid (email)');

      return {
        user_info: user,
        token: this.getJwtToken({ email: email }),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
