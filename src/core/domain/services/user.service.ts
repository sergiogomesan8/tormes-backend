import { Injectable } from '@nestjs/common';
import { IUserService } from '../ports/inbound/user.service.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infraestructure/postgres/entities/user.entity';
import { User } from '../models/user.model';
import { CreateUserDto } from 'src/infraestructure/api-rest/dtos/user.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity | null> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  update(user: User): User {
    console.log(user);
    throw new Error('Method not implemented.');
  }

  delete(id: string): User {
    console.log(id);
    throw new Error('Method not implemented.');
  }

  findOneBy(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  findAll(): User[] {
    throw new Error('Method not implemented.');
  }
}
