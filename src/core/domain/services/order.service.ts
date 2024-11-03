import { InjectRepository } from '@nestjs/typeorm';
import { IOrderService } from '../ports/inbound/order.service.interface';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEntity } from '../../../infraestructure/postgres/entities/order.entity';
import { QueryFailedError, Repository } from 'typeorm';
import {
  Order,
  OrderStatus,
  OrderedProduct,
  ShoppingOrderedProduct,
} from '../models/order.model';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
} from '../../../infraestructure/api-rest/dtos/order.dto';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import { PaymentService } from './payment.service';
import {
  CheckoutDto,
  CheckoutProductDto,
} from 'src/infraestructure/api-rest/dtos/checkout.dto';
import { IPaymentService } from '../ports/inbound/payment.service.interface';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    @Inject('IPaymentService')
    private readonly paymentService: IPaymentService,
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

  async findAllOrdersByUser(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository
      .createQueryBuilder('orders')
      .innerJoin('orders.customer', 'customer')
      .where('customer.id = :userId', { userId })
      .getMany();
    return orders;
  }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<string> {
    try {
      const user = await this.userService.findUserById(userId);

      const orderedProducts: OrderedProduct[] = await this.findOrderedProducts(
        createOrderDto.orderedProducts,
      );

      const checkoutDto = new CheckoutDto(
        await Promise.all(
          orderedProducts.map(async (product) => {
            return new CheckoutProductDto(
              product.product.paymentId,
              product.amount,
              product.product.price * 100,
            );
          }),
        ),
      );

      const { checkout, sessionUrl } =
        await this.paymentService.createCheckout(checkoutDto);

      const order = this.orderRepository.create({
        ...createOrderDto,
        orderedProducts: orderedProducts,
        checkout: checkout,
        customer: user,
        status: OrderStatus.processing,
        total: await this.calculateOrderTotal(orderedProducts),
      });
      await this.orderRepository.save(order);
      return sessionUrl;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(error.message);
      } else {
        throw error;
      }
    }
  }

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const updateResult = await this.orderRepository.update(id, {
      status: updateOrderStatusDto.status,
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

    total = orderedProducts.reduce((accumulator, orderedProduct) => {
      return accumulator + orderedProduct.product.price * orderedProduct.amount;
    }, 0);

    return total;
  }

  private async findOrderedProducts(
    orderedProducts: ShoppingOrderedProduct[],
  ): Promise<OrderedProduct[]> {
    const products: OrderedProduct[] = await Promise.all(
      orderedProducts.map(async (orderedProduct) => {
        const product = await this.productService.findProductById(
          orderedProduct.productId,
        );
        return {
          product: product,
          amount: orderedProduct.amount,
        };
      }),
    );

    return products;
  }
}
