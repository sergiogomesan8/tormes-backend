import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseFilters,
  UseGuards,
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
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { JwtAuthRefreshGuard } from '../../../core/domain/services/jwt-config/refresh-token/refresh-jwt-auth.guard';
import { Request } from 'express';

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
@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user.',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    type: SerializedAuthModel,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SerializedAuthModel> {
    const authUser = await this.authService.register(createUserDto);
    if (authUser) {
      const serializedAuthUser = new SerializedAuthModel(authUser);
      return serializedAuthUser;
    }
  }

  @ApiOperation({
    summary: 'Login a user',
    description: 'Endpoint to login a user.',
  })
  @ApiCreatedResponse({
    description: 'User logged successfully.',
    type: SerializedAuthModel,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<SerializedAuthModel> {
    const authUser = await this.authService.login(loginUserDto);
    if (authUser) {
      const serializedAuthUser = new SerializedAuthModel(authUser);
      return serializedAuthUser;
    }
  }

  @ApiOperation({
    summary: 'Refresh token',
    description: 'Endpoint to refresh token.',
  })
  @ApiCreatedResponse({
    description: 'Token refreshed successfully.',
    type: SerializedAuthModel,
  })
  @UseGuards(JwtAuthRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request): Promise<SerializedAuthModel> {
    const user = req.user;
    const authUser = await this.authService.refreshToken(user['email']);
    if (authUser) {
      const serializedAuthUser = new SerializedAuthModel(authUser);
      return serializedAuthUser;
    }
  }
}
