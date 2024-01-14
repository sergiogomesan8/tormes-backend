import { CreateOrderDto } from '../../../../infraestructure/api-rest/dtos/order.dto';
import { Order, OrderStatus } from '../../models/order.model';

export interface IOrderService {
  findAllOrders(): Promise<Order[]>;
  findOrderById(id: string): Promise<Order | null>;
  findAllOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(createOrderDto: CreateOrderDto): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null>;
  deleteOrder(id: string);
}
