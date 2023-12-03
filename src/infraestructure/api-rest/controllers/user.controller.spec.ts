import { UserController } from './user.controller';
import { UserService } from '../../../core/domain/services/user.service';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import {
  CreateUserDto,
  CreateUserDtoBuilder,
  Gender,
  UserType,
} from '../dtos/user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    userService = { create: jest.fn() } as any;
    userController = new UserController(userService);
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
    it('should return a user entity', async () => {
      const userEntity = new UserEntity();
      (userService.create as jest.Mock).mockResolvedValue(userEntity);

      expect(await userController.create(createUserDto)).toBeInstanceOf(
        UserEntity,
      );
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an exception when userService.create throws an error', async () => {
      (userService.create as jest.Mock).mockRejectedValue(
        new HttpException('ERROR: ', HttpStatus.INTERNAL_SERVER_ERROR),
      );

      await expect(userController.create(createUserDto)).rejects.toBeInstanceOf(
        HttpException,
      );

      await expect(userController.create(createUserDto)).rejects.toHaveProperty(
        'status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
