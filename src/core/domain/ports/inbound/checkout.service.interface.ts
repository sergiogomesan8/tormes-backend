import { CreateOrderDto } from 'src/infraestructure/api-rest/dtos/order.dto';

export interface ICheckoutService {
  createCheckout(userId: string, createOrderDto: CreateOrderDto): Promise<any>;
}
