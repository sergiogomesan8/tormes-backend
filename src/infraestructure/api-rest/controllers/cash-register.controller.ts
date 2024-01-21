import {
  Req,
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseUUIDPipe,
  Param,
  Patch,
  Delete,
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
  ApiParam,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { CashRegisterService } from '../../../core/domain/services/cash-register.service';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/access-token/access-jwt-auth.guard';
import {
  CreateCashRegisterDto,
  UpdateCashRegisterDto,
} from '../dtos/cash-register.dto';
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
    summary: 'Retrieve all cash registers',
    description: 'Endpoint to get a list of all cash registers',
  })
  @UserTypes(UserType.manager)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/list')
  async findAllCashRegisters(): Promise<SeralizedCashRegister[]> {
    const cashRegisters = await this.cashRegisterService.findAllCashRegisters();
    return cashRegisters.map(
      (cashRegister) => new SeralizedCashRegister(cashRegister),
    );
  }

  @ApiOperation({
    summary: 'Retrieve a cash register by ID',
    description: 'Endpoint to get a cash register by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the cash register',
  })
  @UserTypes(UserType.manager)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async findCashRegisterById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SeralizedCashRegister> {
    const cashRegister =
      await this.cashRegisterService.findCashRegisterById(id);
    if (cashRegister) {
      const seralizedCashRegister = new SeralizedCashRegister(cashRegister);
      return seralizedCashRegister;
    }
  }

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

  @ApiOperation({
    summary: 'Update a cash register by ID',
    description: 'Endpoint to update a cash register by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the cash register',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateCashRegister(
    @Param('id') id: string,
    @Body() updateCashRegisterDto: UpdateCashRegisterDto,
  ): Promise<SeralizedCashRegister> {
    const cashRegister = await this.cashRegisterService.updateCashRegister(
      id,
      updateCashRegisterDto,
    );
    if (cashRegister) {
      const seralizedCashRegister = new SeralizedCashRegister(cashRegister);
      return seralizedCashRegister;
    }
  }

  @ApiOperation({
    summary: 'Delete a cash register by ID',
    description: 'Endpoint to delete a cash register by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the cash register',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteCashRegister(@Param('id') id: string) {
    return await this.cashRegisterService.deleteCashRegister(id);
  }
}
