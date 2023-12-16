import { LoginUserDto } from './auth.dto';

describe('LoginUserDto', () => {
  it('should create a LoginUserDto object', () => {
    const email = 'user@example.com';
    const password = expect.any(String);

    const loginUserDto = new LoginUserDto(email, password);

    expect(loginUserDto).toBeDefined();
    expect(loginUserDto.email).toBe(email);
    expect(loginUserDto.password).toBe(password);
  });
});
