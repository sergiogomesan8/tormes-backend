import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ProductDto {
  @ApiProperty({
    description: 'Product id',
    example: 'product-1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

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

  @ApiProperty({
    description: 'Product image',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Product price',
    example: '100',
  })
  @IsNumber()
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
    id: string,
    name: string,
    description: string,
    image: string,
    price: number,
    section: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.section = section;
  }
}

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

  @ApiProperty({
    description: 'Product image',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Product price',
    example: '100',
  })
  @IsNumber()
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
    image: string,
    price: number,
    section: string,
  ) {
    this.name = name;
    this.description = description;
    this.image = image;
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
    name: string,
    description: string,
    image: string,
    price: number,
    section: string,
  ) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.section = section;
  }
}
