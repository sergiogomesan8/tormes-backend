import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from 'src/core/domain/services/user.service';
import { UserEntity } from 'src/infraestructure/postgres/entities/user.entity';
import { CreateUserDto } from '../dtos/user.dto';

@ApiTags('user')
@ApiBearerAuth()
@ApiNoContentResponse({ description: 'No content.' })
@ApiBadRequestResponse({ description: 'Bad request. Invalid data provided.' })
@ApiUnauthorizedResponse({
  description: 'Unauthorized. User authentication failed.',
})
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiNotFoundResponse({
  description: 'Not found. The specified ID does not exist.',
})
@ApiInternalServerErrorResponse({ description: 'Internet Server Error.' })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(createUserDto);
  }
  @Get(':id')
  findOneBy(@Param('id') id: string): Promise<UserEntity | null> {
    return this.userService.findOneBy(id);
  }
}
