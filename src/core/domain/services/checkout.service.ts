import { Injectable, Logger } from '@nestjs/common';
import { StripeService } from '../../../infraestructure/stripe/stripe.service';
import { ProductService } from './product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckoutEntity } from 'src/infraestructure/postgres/entities/checkout.entity';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { CreateOrderDto } from 'src/infraestructure/api-rest/dtos/order.dto';
import {
  CheckoutDto,
  CheckoutProductDto,
} from 'src/infraestructure/api-rest/dtos/checkout.dto';
import { CheckoutStatus } from '../models/checkout.model';
import { ICheckoutService } from '../ports/inbound/checkout.service.interface';

@Injectable()
export class CheckoutService implements ICheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    @InjectRepository(CheckoutEntity)
    private checkoutRepositoy: Repository<CheckoutEntity>,
    private readonly stripeService: StripeService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) { }

  async createCheckout(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<any> {
    try {
      const checkoutDto = new CheckoutDto(
        await Promise.all(
          createOrderDto.orderedProducts.map(async (orderedProduct) => {
            const product = await this.productService.findProductById(
              orderedProduct.productId,
            );
            return new CheckoutProductDto(
              product.paymentId,
              orderedProduct.amount,
              product.price * 100,
            );
          }),
        ),
      );

      const session = await this.stripeService.createCheckout(checkoutDto);

      const checkout = this.checkoutRepositoy.create({
        userId: userId,
        total: session.amount_total / 100,
        currency: session.currency,
        createdAt: session.created,
        status: CheckoutStatus.pending,
        ...createOrderDto,
        sessionId: session.id,
        session: session,
      });
      await this.checkoutRepositoy.save(checkout);
      return session.url;
    } catch (error) {
      this.logger.error(
        `Error creating checkout: ${error.message}`,
        error.stack,
      );
    }
  }

  async verifyWebhookSignature(payload: any, signature: string): Promise<any> {
    return await this.stripeService.verifyWebhookSignature(payload, signature);
  }

  async successCheckout(sessionId: any): Promise<any> {
    const { session, billingDetail } =
      await this.stripeService.successPayment(sessionId);

    if (billingDetail && session.status == 'complete') {
      try {
        const checkout = await this.checkoutRepositoy.findOne({
          where: { sessionId: sessionId },
        });

        await this.checkoutRepositoy.update(checkout.id, {
          status: CheckoutStatus.successfull,
          session: session,
          billingDetail: billingDetail,
        });

        this.orderService.createOrder(
          checkout.userId,
          {
            customerName: checkout.customerName,
            customerContact: checkout.customerContact,
            deliveryAddress: checkout.deliveryAddress,
            billingAddress: checkout.billingAddress,
            paymentMethod: checkout.paymentMethod,
            orderedProducts: checkout.orderedProducts,
          },
          checkout,
        );
      } catch (error) {
        this.logger.error(
          `Error modifying the checkout with sessionId ${sessionId}: ${error.message}`,
          error.stack,
        );
      }
    }
  }

  async failedCheckout(sessionId: any): Promise<any> {
    const session = await this.stripeService.successPayment(sessionId);

    if (session) {
      try {
        const checkout = await this.checkoutRepositoy.findOne({
          where: { sessionId: sessionId },
        });

        await this.checkoutRepositoy.update(checkout.id, {
          status: CheckoutStatus.failed,
          session: session,
        });
      } catch (error) {
        this.logger.error(
          `Error modifying the checkout with sessionId ${sessionId}: ${error.message}`,
          error.stack,
        );
      }
    }
  }
}
