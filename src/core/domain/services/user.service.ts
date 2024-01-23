import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserService } from '../ports/inbound/user.service.interface';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { User, UserType } from '../models/user.model';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('User with this email already exists');
      }
    }
  }

  async createAdminUser(createUserDto: CreateUserDto) {
    const user = await this.findUserByEmail(createUserDto.email);
    if (user) {
      return;
    }
    try {
      const user = this.userRepository.create(createUserDto);
      user.userType = UserType.manager;

      await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('User with this email already exists');
      }
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }
}
