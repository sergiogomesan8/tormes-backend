import { Injectable } from '@nestjs/common';
import { IAuthService } from '../ports/inbound/auth.service.interface';
import { JwtPayload } from './jwt-config/jwt-playload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { UserService } from './user.service';
import { AuthModel } from '../models/auth.model';
// import { LoginUserDto } from '../../../infraestructure/api-rest/dtos/auth.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthModel> {
    try {
      const user = await this.userService.create(createUserDto);

      const token = this.jwtService.sign({ email: user.email });

      return {
        user_info: user,
        token,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  //TODO
  // login(loginUserDto: LoginUserDto) {
  //   const { email } = loginUserDto;

  //   const user = this.userRepository.findOne({
  //     where: { email },
  //     select: { email: true, password: true },
  //   });

  //   if (!user)
  //     throw new UnauthorizedException('Credential are not valid (email)');
  //   // if (!bcrypt.compareSync(password, user.password))
  //   //   throw new UnauthorizedException('Credential are not valid (email)');

  //   return {
  //     ...user,
  //     token: this.getJwtToken({ email: email }),
  //   };
  // }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
