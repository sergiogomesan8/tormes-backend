import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CheckoutDto } from '../api-rest/dtos/checkout.dto';
import { IPaymentService } from '../../core/domain/ports/inbound/payment.service.interface';
import { PaymentProduct } from 'src/core/domain/models/payment.module';

@Injectable()
export class StripeService implements IPaymentService {
  private stripe: Stripe;

  constructor(
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: this.configService.get('STRIPE_API_VERSION'),
    });
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();
    return products.data;
  }

  async createProduct(paymentProduct: PaymentProduct): Promise<Stripe.Product> {
    const product = await this.stripe.products.create({
      name: paymentProduct.name,
      description: paymentProduct.description,
      images: [paymentProduct.imageUrl],
    });

    await this.stripe.prices.create({
      product: product.id,
      unit_amount: paymentProduct.price,
      currency: this.configService.get<string>('STRIPE_PRICE_CURRENCY'),
    });
    return product;
  }

  async updateProduct(
    productId: string,
    paymentProduct: PaymentProduct,
  ): Promise<Stripe.Product> {
    const product = await this.stripe.products.update(productId, {
      name: paymentProduct.name,
      description: paymentProduct.description,
      images: [paymentProduct.imageUrl],
    });

    await this.stripe.prices.create({
      product: product.id,
      unit_amount: paymentProduct.price,
      currency: this.configService.get<string>('STRIPE_PRICE_CURRENCY'),
    });
    return product;
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.stripe.products.del(productId);
  }

  async createCheckoutSession(checkoutDto: CheckoutDto): Promise<string> {
    const lineItems = await Promise.all(
      checkoutDto.orderedProducts.map(async (product) => {
        return {
          price_data: {
            currency: this.configService.get<string>('STRIPE_PRICE_CURRENCY'),
            product: product.productId,
            unit_amount: 1000,
          },
          quantity: product.amount,
        };
      }),
    );

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: [
        this.configService.get(
          'STRIPE_CHECKOUT_SESSION_PAYMENT_METHOD_TYPE_CARD',
        ),
      ],
      line_items: lineItems,
      mode: this.configService.get('STRIPE_CHECKOUT_SESSION_MODE'),
      success_url: this.configService.get<string>(
        'STRIPE_CHECKOUT_SESSION_SUCCCES_URL',
      ),
      cancel_url: this.configService.get<string>(
        'STRIPE_CHECKOUT_SESSION_CANCEL_URL',
      ),
    });

    return session.url;
  }
}
