import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../../../models/auth.model';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../jwt-playload.interface';
import { IAccessJwtService } from '../../../../../core/domain/ports/inbound/access-jwt.service.interface';

@Injectable()
export class AccessJwtService implements IAccessJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getJwtAccessToken(payload: JwtPayload): Promise<Tokens['access_token']> {
    return this.jwtService.signAsync(
      {
        payload,
      },
      {
        secret: this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
      },
    );
  }
}
