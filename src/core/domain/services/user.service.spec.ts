import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm/repository/Repository';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CreateUserDto,
  Gender,
} from '../../../infraestructure/api-rest/dtos/user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  const createUserDto: CreateUserDto = {
    email: 'test@test.com',
    password: 'password',
    name: 'Sergio',
    lastName: 'Gómez',
    deliveryAddres: 'Wall Street',
    billingAddres: 'Calle Falsa 123',
    postalCode: 0,
    gender: Gender.man,
    birthdate: 0,
  };

  describe('create', () => {
    it('should create a user', async () => {
      const user = { name: 'Test User' };
      jest
        .spyOn(userRepository, 'create')
        .mockImplementation(() => user as any);
      jest
        .spyOn(userRepository, 'save')
        .mockImplementation(() => Promise.resolve(user as any));

      expect(await service.create(createUserDto)).toEqual(user);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(userRepository, 'create').mockImplementation(() => {
        throw new Error('Create error');
      });

      try {
        await service.create(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Create error');
      }
    });

    it('should throw an error if save fails', async () => {
      const user = { name: 'Test User' };
      jest
        .spyOn(userRepository, 'create')
        .mockImplementation(() => user as any);
      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        throw new Error('Save error');
      });

      try {
        await service.create(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Save error');
      }
    });
  });
});
