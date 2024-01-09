import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthService } from '../ports/inbound/auth.service.interface';
import { JwtPayload } from './jwt-config/jwt-playload.interface';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { UserService } from './user.service';
import { AuthModel, Tokens } from '../models/auth.model';
import { LoginUserDto } from '../../../infraestructure/api-rest/dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { AccessJwtService } from './jwt-config/access-token/access-jwt.service';
import { RefreshJwtService } from './jwt-config/refresh-token/refresh-jwt.service';

@Injectable()
export class AuthService implements IAuthService {
  static SALT_ROUNDS: number = 10;

  constructor(
    private readonly userService: UserService,
    private readonly accessJwtService: AccessJwtService,
    private readonly refreshJwtService: RefreshJwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthModel> {
    try {
      const { password } = createUserDto;
      const hashedPassword = bcrypt.hashSync(password, AuthService.SALT_ROUNDS);
      const user = await this.userService.createUser({
        ...createUserDto,
        password: hashedPassword,
      });

      const tokens: Tokens = await this.getJwtTokens({
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      });

      return {
        user_info: user,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthModel> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userService.findUserByEmail(email);

      if (!user) throw new UnauthorizedException('Credential are not valid.');
      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credential are not valid.');

      const tokens: Tokens = await this.getJwtTokens({
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      });

      return {
        user_info: user,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error logging user');
    }
  }

  async refreshToken(email: string): Promise<AuthModel> {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) throw new UnauthorizedException('Credential are not valid.');

      const tokens: Tokens = await this.getJwtTokens({
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      });

      return {
        user_info: user,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error refreshing token');
    }
  }

  private async getJwtTokens(payload: JwtPayload): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.accessJwtService.getJwtAccessToken(payload),
      this.refreshJwtService.getJwtRefreshToken(payload),
    ]);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }
}
