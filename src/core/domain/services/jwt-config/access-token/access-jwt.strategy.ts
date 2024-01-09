import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../../../../../infraestructure/postgres/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../jwt-playload.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-jwt',
) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_ACCESS_TOKEN'),
    });
  }
  async validate(payloadWrapper: { payload: JwtPayload }): Promise<UserEntity> {
    console.log('ACCESS validate PAYLOAD: ', payloadWrapper);
    const {
      payload: { id, email, name, userType },
    } = payloadWrapper;

    const user = await this.userRepository.findOneBy({
      id,
      email,
      name,
      userType,
    });

    console.log('ACCESS USER:', user);
    if (!user) throw new UnauthorizedException('Token not valid');

    return user;
  }
}
