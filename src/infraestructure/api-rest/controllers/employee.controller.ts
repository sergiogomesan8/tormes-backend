import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { EmployeeService } from '../../../core/domain/services/employee.service';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/access-token/access-jwt-auth.guard';
import { CreateEmployeeDto } from '../dtos/employee.dto';
import { Employee } from '../../../core/domain/models/employee.model';
import { UserTypes } from '../../../core/domain/services/roles-authorization/roles.decorator';
import { UserType } from '../../../core/domain/models/user.model';
import { RolesGuard } from '../../../core/domain/services/roles-authorization/roles.guard';

@ApiTags('employee')
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
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({
    summary: 'Create a employee',
    description: 'Endpoint to create a employee',
  })
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.createEmployee(createEmployeeDto);
  }
}
