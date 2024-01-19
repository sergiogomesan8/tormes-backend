import {
  CreateOrderDto,
  UpdateOrderStatusDto,
} from '../../../../infraestructure/api-rest/dtos/order.dto';
import { Order } from '../../models/order.model';

export interface IOrderService {
  findAllOrders(): Promise<Order[]>;
  findOrderById(id: string): Promise<Order | null>;
  findAllOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<Order>;
  updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order | null>;
  deleteOrder(id: string);
}
