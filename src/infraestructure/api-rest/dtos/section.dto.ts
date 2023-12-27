import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({
    description: 'Section name',
    example: 'Example Section',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Section image',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  constructor(name: string, image: string) {
    this.name = name;
    this.image = image;
  }
}

export class UpdateSectionDto {
  @ApiProperty({
    description: 'Section name',
    example: 'Example Section',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Section image',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image?: string;

  constructor(name?: string, image?: string) {
    this.name = name;
    this.image = image;
  }
}
