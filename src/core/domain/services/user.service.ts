import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../ports/inbound/user.service.interface';
import { UserRepository } from '../ports/outbound/user.repository.interface';
import { User } from '../models/user';
import {
  UserDto,
  UserPassDto,
} from 'src/infraestructure/api-rest/dtos/user.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository)
    private readonly userPersistence: UserRepository,
  ) {}

  async createUser(userPassDto: UserPassDto): Promise<UserDto> {
    const newUser: User = {
      id: '',
      email: userPassDto.email,
      name: {
        name: userPassDto.name.name,
        lastName: userPassDto.name.lastName,
      },
      gender: userPassDto.gender,
      birthdate: userPassDto.birthdate,
    };

    const result = await this.userPersistence.createUser(newUser);
    return result as UserDto;
  }
}
