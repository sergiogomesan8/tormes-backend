import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../ports/inbound/user.service.interface';
import { UserRepository } from '../ports/outbound/user.repository.interface';
import { UserDto } from 'src/infraestructure/api-rest/dtos/user.dto';
import { User } from '../models/user';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository)
    private readonly userPersistence: UserRepository,
  ) {}

  async createUser(user: User): Promise<UserDto> {
    const result = await this.userPersistence.createUser(user);
    return result as UserDto;
  }
}
