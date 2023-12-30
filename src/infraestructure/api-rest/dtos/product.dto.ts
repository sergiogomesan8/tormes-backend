import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Example Product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'This is an example product.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  file?: any;

  @ApiProperty({
    description: 'Product price',
    example: 100.5,
  })
  @IsNumberString()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Product section',
    example: 'Example Section',
  })
  @IsString()
  @IsNotEmpty()
  section: string;

  constructor(
    name: string,
    description: string,
    price: number,
    section: string,
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.section = section;
  }
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Example Product',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'This is an example product.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product image',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Product price',
    example: '100',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Product section',
    example: 'Example Section',
    required: false,
  })
  @IsString()
  @IsOptional()
  section?: string;

  constructor(
    name?: string,
    description?: string,
    image?: string,
    price?: number,
    section?: string,
  ) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.section = section;
  }
}
