import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm/repository/Repository';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../../../infraestructure/api-rest/dtos/user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
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

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  const email = 'user@example.com';
  const password = expect.any(String);
  const name = 'John';

  const createUserDto = new CreateUserDto(name, email, password);
  const user = { name: 'Test User' };

  describe('create', () => {
    it('should create a user', async () => {
      jest
        .spyOn(userRepository, 'create')
        .mockImplementation(() => user as any);
      jest
        .spyOn(userRepository, 'save')
        .mockImplementation(() => Promise.resolve(user as any));

      expect(await userService.createUser(createUserDto)).toEqual(user);
    });

    it('should throw ConflictException when product name already exists', async () => {
      jest
        .spyOn(userRepository, 'create')
        .mockImplementation(() => user as any);
      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('query', [], new Error());
      });

      try {
        await userService.createUser(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('User with this email already exists');
      }
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(userRepository, 'create').mockImplementation(() => {
        throw new Error('Create error');
      });

      try {
        await userService.createUser(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Create error');
      }
    });

    it('should throw an error if save fails', async () => {
      jest
        .spyOn(userRepository, 'create')
        .mockImplementation(() => user as any);
      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        throw new Error('Save error');
      });

      try {
        await userService.createUser(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Save error');
      }
    });
  });
  describe('findUserByEmail', () => {
    it('should return a user if one is found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => user as any);

      const foundUser = await userService.findUserByEmail('test@example.com');
      expect(foundUser).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw an error if one occurs', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValue(new Error('Test error'));

      await expect(
        userService.findUserByEmail('test@example.com'),
      ).rejects.toThrow('Test error');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return NotFoundException when user does not exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        userService.findUserByEmail(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });
});
