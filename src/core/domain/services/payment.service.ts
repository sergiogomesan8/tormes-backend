import { Injectable } from '@nestjs/common';
import { IPaymentService } from '../ports/inbound/payment.service.interface';
import { StripeService } from '../../../infraestructure/stripe/stripe.service';
import Stripe from 'stripe';
import { PaymentProduct } from '../models/payment.module';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async createProduct(paymentProduct: PaymentProduct): Promise<Stripe.Product> {
    let unitAmount = paymentProduct.price * 100;
    paymentProduct.price = unitAmount;
    return await this.stripeService.createProduct(paymentProduct);
  }

  async updateProduct(
    productId: string,
    paymentProduct: PaymentProduct,
  ): Promise<Stripe.Product> {
    return await this.stripeService.updateProduct(productId, paymentProduct);
  }

  async deleteProduct(productId: string): Promise<void> {
    return await this.stripeService.deleteProduct(productId);
  }
}
