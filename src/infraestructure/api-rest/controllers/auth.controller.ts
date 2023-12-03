import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../../../core/domain/services/auth.service';
import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../../../core/domain/models/user.model';

@ApiTags('auth')
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
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user.',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    type: CreateUserDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      console.error(error);
      throw new HttpException('ERROR: ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
