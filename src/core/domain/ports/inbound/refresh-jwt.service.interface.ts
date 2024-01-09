import { Tokens } from '../../models/auth.model';
import { JwtPayload } from '../../services/jwt-config/jwt-playload.interface';

export interface IRefreshJwtService {
  getJwtRefreshToken(payload: JwtPayload): Promise<Tokens['refresh_token']>;
}
