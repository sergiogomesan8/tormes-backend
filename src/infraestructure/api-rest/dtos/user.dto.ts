import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class NameDto {
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

  constructor(name: string, lastName: string) {
    this.name = name;
    this.lastName = lastName;
  }
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
    description: 'User name',
    type: NameDto,
  })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  name: NameDto;

  @ApiProperty({
    description: 'Gender',
    example: 'Women',
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

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
    id: string,
    email: string,
    name: NameDto,
    gender: string,
    birthdate: number,
    createdAt?: number,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.birthdate = birthdate;
    this.createdAt = createdAt;
  }
}

export class UserPassDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User name',
    type: NameDto,
  })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty({
    description: 'Gender',
    example: 'Women',
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: 'birthdate date',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  birthdate: number;

  constructor(
    email: string,
    name: NameDto,
    password: string,
    gender: string,
    birthdate: number,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.birthdate = birthdate;
  }
}
