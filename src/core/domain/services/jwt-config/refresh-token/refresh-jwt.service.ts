import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../../../models/auth.model';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../jwt-playload.interface';
import { IRefreshJwtService } from '../../../../../core/domain/ports/inbound/refresh-jwt.service.interface';

@Injectable()
export class RefreshJwtService implements IRefreshJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getJwtRefreshToken(payload: JwtPayload): Promise<Tokens['refresh_token']> {
    return this.jwtService.signAsync(
      {
        payload,
      },
      {
        secret: this.configService.get('JWT_SECRET_REFRESH_TOKEN'),
      },
    );
  }
}
