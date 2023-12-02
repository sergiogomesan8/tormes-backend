import { Body, Controller, Post } from '@nestjs/common';
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
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { CreateUserDto } from '../dtos/user.dto';
import { UserService } from '../../../core/domain/services/user.service';

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

  //TODO: Implementar los siguientes métodos:
  // @Get(':id')
  // findOneBy(@Param('id') id: string): Promise<UserEntity | null> {
  //   return this.userService.findOneBy(id);
  // }
}
