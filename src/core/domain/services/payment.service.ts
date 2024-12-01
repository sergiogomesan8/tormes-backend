import { Injectable, Logger } from '@nestjs/common';
import { IPaymentService } from '../ports/inbound/payment.service.interface';
import { StripeService } from '../../../infraestructure/stripe/stripe.service';
import Stripe from 'stripe';
import { PaymentProduct } from '../models/payment.model';

@Injectable()
export class PaymentService implements IPaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly stripeService: StripeService) {}

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
}
