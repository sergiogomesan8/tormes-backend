import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({
    description: 'Section name',
    example: 'Example Section',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image: any;

  constructor(name: string) {
    this.name = name;
  }
}

export class UpdateSectionDto {
  @ApiProperty({
    description: 'Section name',
    example: 'Example Section',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: any;

  constructor(name?: string, image?: any) {
    this.name = name;
    this.image = image;
  }
}
