import { Tokens } from '../../models/auth.model';
import { JwtPayload } from '../../services/jwt-config/jwt-playload.interface';

export interface IAccessJwtService {
  getJwtAccessToken(payload: JwtPayload): Promise<Tokens['access_token']>;
}
