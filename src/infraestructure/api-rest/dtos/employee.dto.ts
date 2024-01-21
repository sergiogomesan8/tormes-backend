import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Employee email',
    example: 'employee@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Employee name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Employee last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Employee job',
    example: 'Butcher',
  })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiProperty({
    description: 'Employee hire date',
    example: '123456789',
  })
  @IsNumber()
  @IsNotEmpty()
  hireDate: number;

  @ApiProperty({
    description: 'Employee address',
    example: 'Street 123',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  constructor(
    email: string,
    name: string,
    lastName: string,
    job: string,
    address: string,
  ) {
    this.email = email;
    this.name = name;
    this.lastName = lastName;
    this.job = job;
    this.address = address;
  }
}
