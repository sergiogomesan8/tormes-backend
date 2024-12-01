import {
  CreateOrderDto,
  UpdateOrderStatusDto,
} from '../../../../infraestructure/api-rest/dtos/order.dto';
import { Checkout } from '../../models/checkout.model';
import { Order } from '../../models/order.model';

export interface IOrderService {
  findAllOrders(): Promise<Order[]>;
  findOrderById(id: string): Promise<Order | null>;
  findAllOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
    checkout: Checkout,
  ): Promise<Order>;
  updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order | null>;
  deleteOrder(id: string);
}
