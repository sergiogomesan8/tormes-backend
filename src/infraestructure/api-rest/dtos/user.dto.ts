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

export class CreateUserDtoBuilder {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phoneNumber: number;
  deliveryAddres: string;
  billingAddres: string;
  postalCode: number;
  gender: Gender;
  birthdate: number;
  userType: UserType;

  setEmail(email: string): this {
    this.email = email;
    return this;
  }

  setPassword(password: string): this {
    this.password = password;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setLastName(lastName: string): this {
    this.lastName = lastName;
    return this;
  }

  setPhoneNumber(phoneNumber: number): this {
    this.phoneNumber = phoneNumber;
    return this;
  }

  setDeliveryAddres(deliveryAddres: string): this {
    this.deliveryAddres = deliveryAddres;
    return this;
  }

  setBillingAddres(billingAddres: string): this {
    this.billingAddres = billingAddres;
    return this;
  }

  setPostalCode(postalCode: number): this {
    this.postalCode = postalCode;
    return this;
  }

  setGender(gender: Gender): this {
    this.gender = gender;
    return this;
  }

  setBirthdate(birthdate: number): this {
    this.birthdate = birthdate;
    return this;
  }

  setUserType(userType: UserType): this {
    this.userType = userType;
    return this;
  }

  build(): CreateUserDto {
    return new CreateUserDto(this);
  }
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User Password',
    example: 'Password123*',
  })
  @IsNotEmpty()
  password: string;

  constructor(builder: CreateUserDtoBuilder) {
    this.name = builder.name;
    this.email = builder.email;
    this.password = builder.password;
  }
}
