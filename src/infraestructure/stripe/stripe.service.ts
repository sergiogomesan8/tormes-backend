import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentProduct } from '../../core/domain/models/payment.model';
import { StripeError } from './exceptions/stripe.errors';
import { CheckoutDto } from '../api-rest/dtos/checkout.dto';
import { IStripeService } from '../../core/domain/ports/outbound/stripe.service.interface';

@Injectable()
export class StripeService implements IStripeService {
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
      this.handleError('Error retrieving products', error);
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
      this.handleError('Error creating product', error);
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
      this.handleError('Error updating product', error);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.stripe.products.update(productId, { active: false });
    } catch (error) {
      this.handleError('Error deleting product', error);
    }
  }

  async createCheckout(checkoutDto: CheckoutDto): Promise<any> {
    try {
      const lineItems = await Promise.all(
        checkoutDto.orderedProducts.map(async (product) => {
          return {
            price_data: {
              currency: this.configService.get<string>('STRIPE_PRICE_CURRENCY'),
              product: product.paymentId,
              unit_amount: product.price,
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
        success_url: `${this.configService.get<string>(
          'TORMES_FRONTEND_URL',
        )}${this.configService.get<string>(
          'TORMES_FRONTEND_PORT',
        )}${this.configService.get<string>(
          'STRIPE_CHECKOUT_SESSION_SUCCCES_URL',
        )}`,
        cancel_url: `${this.configService.get<string>(
          'TORMES_FRONTEND_URL',
        )}${this.configService.get<string>(
          'TORMES_FRONTEND_PORT',
        )}${this.configService.get<string>(
          'STRIPE_CHECKOUT_SESSION_CANCEL_URL',
        )}`,
      });
      return session;
    } catch (error) {
      this.handleError('Error creating checkout session', error);
    }
  }

  async successPayment(sessionId: any): Promise<any> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      const billingDetail =
        await this.stripe.checkout.sessions.listLineItems(sessionId);

      return { session: session, billingDetail: billingDetail };
    } catch (error) {
      this.handleError('Error retrieving success payment details', error);
    }
  }

  async failedPayment(sessionId: any): Promise<any> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      const billingDetail =
        await this.stripe.checkout.sessions.listLineItems(sessionId);

      return { session: session, billingDetail: billingDetail };
    } catch (error) {
      this.handleError('Error retrieving failed payment details', error);
    }
  }

  async verifyWebhookSignature(payload: any, signature: string): Promise<any> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
      );
      return event;
    } catch (error) {
      this.handleError('Error verifying webhook signature', error);
    }
  }

  private handleError(firstMessage: string, error: any): void {
    this.logger.error(`${firstMessage}: ${error.message}`, error.stack);
    throw new StripeError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
