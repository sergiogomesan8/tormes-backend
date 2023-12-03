import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from '../ports/inbound/auth.service.interface';
import { JwtPayload } from './jwt-config/jwt-playload.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../../infraestructure/api-rest/dtos/auth.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ email: user.email }),
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  login(loginUserDto: LoginUserDto) {
    const { email } = loginUserDto;

    const user = this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user)
      throw new UnauthorizedException('Credential are not valid (email)');
    // if (!bcrypt.compareSync(password, user.password))
    //   throw new UnauthorizedException('Credential are not valid (email)');

    return {
      ...user,
      token: this.getJwtToken({ email: email }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
