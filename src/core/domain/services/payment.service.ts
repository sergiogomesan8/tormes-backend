import { Injectable } from '@nestjs/common';
import { IPaymentService } from '../ports/inbound/payment.service.interface';
import { StripeService } from 'src/infraestructure/stripe/stripe.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async createProduct(
    name: string,
    description: string,
    imageUrl: string,
    price: number,
  ): Promise<Stripe.Product> {
    const unitAmount = price * 100;
    return await this.stripeService.createProduct(
      name,
      description,
      imageUrl,
      unitAmount,
    );
  }

  async updateProduct(
    productId: string,
    name: string,
    description: string,
    imageUrl: string,
    price: number,
  ): Promise<Stripe.Product> {
    const unitAmount = price * 100;
    return await this.stripeService.updateProduct(
      productId,
      name,
      description,
      imageUrl,
      unitAmount,
    );
  }

  async deleteProduct(productId: string): Promise<void> {
    return await this.stripeService.deleteProduct(productId);
  }
}
