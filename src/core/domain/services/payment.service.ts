import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { IPaymentService } from '../ports/inbound/payment.service.interface';
import { StripeService } from '../../../infraestructure/stripe/stripe.service';
import Stripe from 'stripe';
import { ProductService } from './product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckoutEntity } from 'src/infraestructure/postgres/entities/checkout.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { OrderService } from './order.service';
import { CreateOrderDto } from 'src/infraestructure/api-rest/dtos/order.dto';
import { PaymentProduct } from '../models/payment.model';
import {
  CheckoutDto,
  CheckoutProductDto,
} from 'src/infraestructure/api-rest/dtos/checkout.dto';
import { CheckoutStatus } from '../models/checkout.model';
import { OrderedProduct } from '../models/order.model';

@Injectable()
export class PaymentService implements IPaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(CheckoutEntity)
    private checkoutRepositoy: Repository<CheckoutEntity>,
    private readonly stripeService: StripeService,
  ) {}

  async createProduct(paymentProduct: PaymentProduct): Promise<Stripe.Product> {
    paymentProduct.price *= 100;
    return await this.stripeService.createProduct(paymentProduct);
  }

  async updateProduct(
    productId: string,
    paymentProduct: PaymentProduct,
  ): Promise<Stripe.Product> {
    if (paymentProduct.price) {
      paymentProduct.price *= 100;
    }
    return await this.stripeService.updateProduct(productId, paymentProduct);
  }

  async deleteProduct(productId: string): Promise<void> {
    return await this.stripeService.deleteProduct(productId);
  }

  async createCheckout(checkoutDto: CheckoutDto): Promise<any> {
    try {
      const session = await this.stripeService.createCheckout(checkoutDto);

      const checkout = this.checkoutRepositoy.create({
        total: session.amount_total / 100,
        currency: session.currency,
        createdAt: session.created,
        status: CheckoutStatus.pending,
        sessionId: session.id,
      });
      await this.checkoutRepositoy.save(checkout);
      return { checkout: checkout, sessionUrl: session.url };
    } catch (error) {
      this.logger.error(
        `Error creating checkout: ${error.message}`,
        error.stack,
      );
    }
  }

  async successPayment(sessionId: any): Promise<any> {
    const { billingDetail, _ } =
      await this.stripeService.successPayment(sessionId);

    try {
      const checkout = await this.checkoutRepositoy.findOne({
        where: { sessionId: sessionId },
      });

      await this.checkoutRepositoy.update(checkout.id, {
        status: CheckoutStatus.successfull,
        billingDetail: billingDetail,
      });
    } catch (error) {
      this.logger.error(
        `Error modifying the checkout with sessionId ${sessionId}: ${error.message}`,
        error.stack,
      );
    }
  }

  async failedPayment(sessionId: any): Promise<any> {}
}
