import { Gender } from '../../../core/domain/models/user.model';
import { UserDto, CreateUserDto } from './user.dto';

describe('UserDto', () => {
  it('should create a UserDto object', () => {
    const email = 'user@example.com';
    const name = 'John';
    const lastName = 'Doe';
    const gender = Gender.man;
    const birthdate = 20000101;

    const userDto = new UserDto(email, name, lastName, gender, birthdate);

    expect(userDto).toBeDefined();
    expect(userDto.email).toBe(email);
    expect(userDto.name).toBe(name);
    expect(userDto.lastName).toBe(lastName);
    expect(userDto.gender).toBe(gender);
    expect(userDto.birthdate).toBe(birthdate);
  });
});

describe('CreateUserDto', () => {
  it('should create a CreateUserDto object', () => {
    const email = 'user@example.com';
    const password = expect.any(String);
    const name = 'John';

    const createUserDto = new CreateUserDto(name, email, password);

    expect(createUserDto).toBeDefined();
    expect(createUserDto.email).toBe(email);
    expect(createUserDto.password).toBe(password);
    expect(createUserDto.name).toBe(name);
  });
});
