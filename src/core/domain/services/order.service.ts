import { InjectRepository } from '@nestjs/typeorm';
import { IOrderService } from '../ports/inbound/order.service.interface';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEntity } from '../../../infraestructure/postgres/entities/order.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Order, OrderStatus, OrderedProduct } from '../models/order.model';
import { CreateOrderDto } from '../../../infraestructure/api-rest/dtos/order.dto';
import { ProductService } from './product.service';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private readonly productService: ProductService,
  ) {}
  async findAllOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    return orders;
  }
  async findOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
    });

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    return order;
  }

  findAllOrdersByUser(userId: string): Promise<Order[]> {
    const orders = this.orderRepository.find({ where: { customer: userId } });
    return orders;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = this.orderRepository.create(createOrderDto);
      await this.orderRepository.save(order);
      return order;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Order with this name already exists');
      }
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const updateResult = await this.orderRepository.update(id, {
      status: status,
    });
    if (updateResult.affected === 0) {
      throw new NotFoundException('Order not found');
    }

    const updateOrder = await this.orderRepository.findOne({
      where: { id: id },
    });
    if (!updateOrder) {
      throw new NotFoundException('Error retrieving updated product');
    }
    return updateOrder;
  }

  async deleteOrder(id: string) {
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepository.delete(id);
    return { message: `Order with id ${id} was deleted.` };
  }

  private async calculateOrderTotal(
    orderedProducts: OrderedProduct[],
  ): Promise<number> {
    let total = 0;
    const products = await Promise.all(
      orderedProducts.map(async (orderedProduct) => {
        const product = await this.productService.findProductById(
          orderedProduct.product.id,
        );
        return product.price * orderedProduct.amount;
      }),
    );

    total = products.reduce((a, b) => a + b, 0);
    return total;
  }
}
