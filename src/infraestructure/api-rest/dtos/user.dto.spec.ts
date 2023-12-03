import { UserDto, Gender, UserType, CreateUserDto } from './user.dto';

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
    const name = 'John';
    const lastName = 'Doe';
    const phoneNumber = 123456789;
    const gender = Gender.man;
    const birthdate = 20000101;
    const userType = UserType.customer;

    const createUserDto = new CreateUserDto(
      email,
      name,
      lastName,
      phoneNumber,
      gender,
      birthdate,
      userType,
    );

    expect(createUserDto).toBeDefined();
    expect(createUserDto.email).toBe(email);
    expect(createUserDto.name).toBe(name);
    expect(createUserDto.lastName).toBe(lastName);
    expect(createUserDto.phoneNumber).toBe(phoneNumber);
    expect(createUserDto.gender).toBe(gender);
    expect(createUserDto.birthdate).toBe(birthdate);
    expect(createUserDto.userType).toBe(userType);
  });
});
