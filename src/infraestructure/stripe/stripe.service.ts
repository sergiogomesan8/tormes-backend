import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CheckoutDto } from '../api-rest/dtos/checkout.dto';
import { IPaymentService } from '../../core/domain/ports/inbound/payment.service.interface';
import { PaymentProduct } from 'src/core/domain/models/payment.module';
import { StripeError } from './exceptions/stripe.errors';

@Injectable()
export class StripeService implements IPaymentService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    @Inject('STRIPE') private readonly stripeProvider: Stripe,
    private readonly configService: ConfigService,
  ) {
    this.stripe = stripeProvider;
  }

  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list();
      return products.data;
    } catch (error) {
      this.logger.error(
        `Error retrieving products: ${error.message}`,
        error.stack,
      );
      throw new StripeError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createProduct(paymentProduct: PaymentProduct): Promise<Stripe.Product> {
    try {
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
    } catch (error) {
      this.logger.error(
        `Error creating product: ${error.message}`,
        error.stack,
      );
      throw new StripeError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProduct(
    productId: string,
    paymentProduct: PaymentProduct,
  ): Promise<Stripe.Product> {
    try {
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
    } catch (error) {
      this.logger.error(
        `Error updating product: ${error.message}`,
        error.stack,
      );
      throw new StripeError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.stripe.products.del(productId);
    } catch (error) {
      this.logger.error(
        `Error deleting product: ${error.message}`,
        error.stack,
      );
      throw new StripeError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCheckoutSession(checkoutDto: CheckoutDto): Promise<string> {
    try {
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
    } catch (error) {
      this.logger.error(
        `Error creating checkout session: ${error.message}`,
        error.stack,
      );
      throw new StripeError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
