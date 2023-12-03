import { UserDto, Gender, UserType, CreateUserDto } from './user.dto';

describe('UserDto', () => {
  it('should create a UserDto object', () => {
    const user = new UserDto(
      'user@example.com',
      'John',
      'Doe',
      Gender.man,
      20000101,
    );

    expect(user).toBeDefined();
    expect(user.email).toBe('user@example.com');
    expect(user.name).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.gender).toBe(Gender.man);
    expect(user.birthdate).toBe(20000101);
  });

  it('should fail if email is not valid', () => {
    expect(() => {
      new UserDto('invalidEmail', 'John', 'Doe', Gender.man, 20000101);
    }).toThrow();
  });
});

describe('CreateUserDto', () => {
  it('should create a CreateUserDto object', () => {
    const user = new CreateUserDto(
      'user@example.com',
      'John',
      'Doe',
      123456789,
      Gender.man,
      20000101,
      UserType.customer,
    );

    expect(user).toBeDefined();
    expect(user.email).toBe('user@example.com');
    expect(user.name).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.phoneNumber).toBe(123456789);
    expect(user.gender).toBe(Gender.man);
    expect(user.birthdate).toBe(20000101);
    expect(user.userType).toBe(UserType.customer);
  });

  it('should fail if email is not valid', () => {
    expect(() => {
      new CreateUserDto(
        'invalidEmail',
        'John',
        'Doe',
        123456789,
        Gender.man,
        20000101,
        UserType.customer,
      );
    }).toThrow();
  });

  // Add more tests for other validation rules
});
