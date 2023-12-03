import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm/repository/Repository';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CreateUserDto,
  CreateUserDtoBuilder,
  Gender,
  UserType,
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

  const createUserDto: CreateUserDto = new CreateUserDtoBuilder()
    .setEmail('test@test.com')
    .setPassword('Password123*')
    .setName('Sergio')
    .setLastName('Gómez')
    .setPhoneNumber(1234567890)
    .setDeliveryAddres('Wall Street')
    .setBillingAddres('Calle Falsa 123')
    .setPostalCode(12345)
    .setGender(Gender.man)
    .setBirthdate(0)
    .setUserType(UserType.customer)
    .build();

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
