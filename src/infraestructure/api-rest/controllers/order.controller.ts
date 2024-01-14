import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import {
  Controller,
  UseFilters,
  Get,
  Req,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Body,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrderService } from '../../../core/domain/services/order.service';
import { Order, OrderStatus } from '../../../core/domain/models/order.model';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/access-token/access-jwt-auth.guard';
import { Request } from 'express';
import { CreateOrderDto } from '../dtos/order.dto';
import { RolesGuard } from '../../../core/domain/services/roles-authorization/roles.guard';
import { UserType } from '../../../core/domain/models/user.model';
import { UserTypes } from '../../../core/domain/services/roles-authorization/roles.decorator';

@ApiTags('order')
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
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Retrieve all orders',
    description: 'Endpoint to get a list of all orders',
  })
  @Get('/list')
  async findAllOrders(): Promise<Order[]> {
    return await this.orderService.findAllOrders();
  }

  @ApiOperation({
    summary: 'Retrieve an order by ID',
    description: 'Endpoint to get an order by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the order' })
  @Get('/:id')
  async findOrderById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Order> {
    return await this.orderService.findOrderById(id);
  }

  @ApiOperation({
    summary: 'Retrieve all orders for a user',
    description:
      'Endpoint to get a list of all orders for the currently authenticated user',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllOrdersByUser(@Req() req: Request): Promise<Order[]> {
    const user = req.user;
    return await this.orderService.findAllOrdersByUser(user['id']);
  }

  @ApiOperation({
    summary: 'Create an order',
    description: 'Endpoint to create an order',
  })
  @ApiCreatedResponse({
    description: 'Order created successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @ApiOperation({
    summary: 'Update an order status by ID',
    description: 'Endpoint to update an order status by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the order' })
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id')
  async updateOrderStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() status: OrderStatus,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(id, status);
  }

  @ApiOperation({
    summary: 'Delete an order by ID',
    description: 'Endpoint to delete an order by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the order' })
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  async deleteOrder(@Param('id') id: string) {
    return await this.orderService.deleteOrder(id);
  }
}
