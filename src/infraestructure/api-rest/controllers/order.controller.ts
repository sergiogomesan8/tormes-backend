import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
  Patch,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from '../../../core/domain/services/order.service';
import { SeralizedOrder } from '../../../core/domain/models/order.model';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/access-token/access-jwt-auth.guard';
import { Request } from 'express';
import { UpdateOrderStatusDto } from '../dtos/order.dto';
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
  async findAllOrders(): Promise<SeralizedOrder[]> {
    const orders = await this.orderService.findAllOrders();
    return orders.map((order) => new SeralizedOrder(order));
  }

  @ApiOperation({
    summary: 'Retrieve an order by ID',
    description: 'Endpoint to get an order by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the order' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async findOrderById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SeralizedOrder> {
    const order = await this.orderService.findOrderById(id);
    if (order) {
      const seralizedOrder = new SeralizedOrder(order);
      return seralizedOrder;
    }
  }

  @ApiOperation({
    summary: 'Retrieve all orders for a user',
    description:
      'Endpoint to get a list of all orders for the currently authenticated user',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAllOrdersByUser(@Req() req: Request): Promise<SeralizedOrder[]> {
    const user = req.user;
    const orders = await this.orderService.findAllOrdersByUser(user['id']);
    return orders.map((order) => new SeralizedOrder(order));
  }

  // @ApiOperation({
  //   summary: 'Create an order',
  //   description: 'Endpoint to create an order',
  // })
  // @ApiCreatedResponse({
  //   description: 'Order created successfully',
  // })
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Post()
  // async createOrder(
  //   @Req() req: Request,
  //   @Body() createOrderDto: CreateOrderDto,
  // ): Promise<any> {
  //   const user = req.user;
  //   const sessionUrl = await this.orderService.createOrder(
  //     user['id'],
  //     createOrderDto,
  //   );
  //   return { sessionUrl: sessionUrl };
  // }

  @ApiOperation({
    summary: 'Update an order status by ID',
    description: 'Endpoint to update an order status by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the order' })
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id')
  async updateOrderStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<SeralizedOrder> {
    const order = await this.orderService.updateOrderStatus(
      id,
      updateOrderStatusDto,
    );
    if (order) {
      const seralizedOrder = new SeralizedOrder(order);
      return seralizedOrder;
    }
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
