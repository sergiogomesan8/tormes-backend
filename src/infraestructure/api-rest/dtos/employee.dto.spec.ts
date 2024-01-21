import { CreateEmployeeDto } from './employee.dto';

describe('CreateEmployeeDto', () => {
  it('should create a CreateEmployeeDto object', () => {
    const email = 'employee@example.com';
    const name = 'John';
    const lastName = 'Doe';
    const job = 'Butcher';

    const createEmployeeDto = new CreateEmployeeDto(email, name, lastName, job);

    expect(createEmployeeDto).toBeDefined();
    expect(createEmployeeDto.email).toBe(email);
    expect(createEmployeeDto.name).toBe(name);
    expect(createEmployeeDto.lastName).toBe(lastName);
    expect(createEmployeeDto.job).toBe(job);
  });
});
