import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';

export enum UserType {
  customer = 1,
  employee = 2,
  manager = 3,
}

export enum Gender {
  man = 1,
  women = 2,
  other = 3,
}

export class UserDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '1234',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Given name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Middle name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Gender',
    example: 'Women',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'birthdate date',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  birthdate: number;

  @ApiProperty({
    description: 'Timestamp of user creation',
    example: 1634476800000,
    required: false,
  })
  @IsOptional()
  createdAt?: number;

  constructor(
    email: string,
    name: string,
    lastName: string,
    gender: Gender,
    birthdate: number,
  ) {
    this.email = email;
    this.name = name;
    this.lastName = lastName;
    this.gender = gender;
    this.birthdate = birthdate;
  }
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Given name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Middle name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User phone number',
    example: '123456789',
  })
  @IsOptional()
  @IsNumber()
  phoneNumber?: number;

  @ApiProperty({
    description: 'Gender',
    example: 1,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'birthdate date',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  birthdate: number;

  @ApiProperty({
    description: 'User type',
    enum: UserType,
    example: UserType.customer,
  })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  constructor(
    email: string,
    name: string,
    lastName: string,
    phoneNumber: number,
    gender: Gender,
    birthdate: number,
    userType: UserType,
  ) {
    this.email = email;
    this.name = name;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.gender = gender;
    this.birthdate = birthdate;
    this.userType = userType;
  }
}
