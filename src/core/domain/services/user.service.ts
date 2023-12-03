import { Injectable } from '@nestjs/common';
import { IUserService } from '../ports/inbound/user.service.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { User } from '../models/user.model';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //TODO: Implementar los siguientes métodos:
  // findOneBy(id: string): Promise<UserEntity | null> {
  //   return this.userRepository.findOneBy({ id });
  // }
}
