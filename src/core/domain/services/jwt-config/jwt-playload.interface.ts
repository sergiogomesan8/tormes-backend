import { UserType } from '../../models/user.model';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  userType: UserType;
}
