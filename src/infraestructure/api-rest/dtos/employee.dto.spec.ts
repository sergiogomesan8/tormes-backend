import { CreateEmployeeDto } from './employee.dto';

describe('CreateEmployeeDto', () => {
  it('should create a CreateEmployeeDto object', () => {
    const email = 'employee@example.com';
    const name = 'John';
    const lastName = 'Doe';
    const job = 'Butcher';
    const address = 'Fake Street 123';

    const createEmployeeDto = new CreateEmployeeDto(
      email,
      name,
      lastName,
      job,
      address,
    );

    expect(createEmployeeDto).toBeDefined();
    expect(createEmployeeDto.email).toBe(email);
    expect(createEmployeeDto.name).toBe(name);
    expect(createEmployeeDto.lastName).toBe(lastName);
    expect(createEmployeeDto.job).toBe(job);
    expect(createEmployeeDto.address).toBe(address);
  });
});
