import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto, UserPassDto } from '../dtos/user.dto';
import { User } from 'src/core/domain/models/user';
import { UserService } from 'src/core/domain/services/user.service';

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

  @Post('/register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user.',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    type: UserPassDto,
  })
  //@Guards.Public()
  async registerWithEmailAndPassword(
    @Body() userPassDto: UserPassDto,
  ): Promise<UserDto> {
    const authUID = 'sadf';

    if (!userPassDto) {
      throw new BadRequestException(
        'Bad request. Invalid data provided: user object is null',
      );
    }
    const newUser: User = {
      id: authUID,
      email: userPassDto.email,
      name: {
        name: userPassDto.name.name,
        lastName: userPassDto.name.lastName,
      },
      gender: userPassDto.gender,
      birthdate: userPassDto.birthdate,
    };

    const result = await this.userService.createUser(newUser).catch((error) => {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
    });

    return result;
  }
}
