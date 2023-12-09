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
import { SerializedAuthModel } from '../../../core/domain/models/auth.model';
import { LoginUserDto } from '../dtos/auth.dto';

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
  ): Promise<SerializedAuthModel> {
    try {
      const authUser = await this.authService.register(createUserDto);
      if (authUser) {
        const serializedAuthUser = new SerializedAuthModel(authUser);
        return serializedAuthUser;
      }
    } catch (error) {
      console.error(error);
      throw new HttpException('ERROR: ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description: 'Endpoint to login a user.',
  })
  @ApiCreatedResponse({
    description: 'User logged successfully.',
    type: CreateUserDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<SerializedAuthModel> {
    try {
      const authUser = await this.authService.login(loginUserDto);
      if (authUser) {
        const serializedAuthUser = new SerializedAuthModel(authUser);
        return serializedAuthUser;
      }
    } catch (error) {
      console.error(error);
      throw new HttpException('ERROR: ', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
