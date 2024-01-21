import {
  Req,
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { CashRegisterService } from '../../../core/domain/services/cash-register.service';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/access-token/access-jwt-auth.guard';
import { CreateCashRegisterDto } from '../dtos/cash-register.dto';
import {
  CashRegister,
  SeralizedCashRegister,
} from '../../../core/domain/models/cash-register.model';
import { RolesGuard } from '../../../core/domain/services/roles-authorization/roles.guard';
import { UserType } from '../../../core/domain/models/user.model';
import { UserTypes } from '../../../core/domain/services/roles-authorization/roles.decorator';
import { Request } from 'express';

@ApiTags('cash-register')
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
@Controller('cash-register')
export class CashRegisterController {
  constructor(private readonly cashRegisterService: CashRegisterService) {}

  @ApiOperation({
    summary: 'To close Cash Register',
    description: 'Endpoint to close Cash Register',
  })
  @UserTypes(UserType.manager)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createCashRegister(
    @Req() req: Request,
    @Body() createCashRegisterDto: CreateCashRegisterDto,
  ): Promise<CashRegister> {
    const user = req.user;

    const cashRegister = await this.cashRegisterService.createCashRegister(
      user['id'],
      createCashRegisterDto,
    );

    if (cashRegister) {
      const seralizedCashRegister = new SeralizedCashRegister(cashRegister);
      return seralizedCashRegister;
    }
  }
}
