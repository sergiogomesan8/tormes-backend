import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeError } from './exceptions/stripe.errors';
import { HttpStatus } from '@nestjs/common';
import { CheckoutDto } from '../api-rest/dtos/checkout.dto';

describe('StripeService', () => {
  let stripeService: StripeService;
  let stripe: Partial<Stripe>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: 'STRIPE',
          useValue: {
            products: {
              list: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              del: jest.fn(),
            },
            prices: {
              create: jest.fn(),
            },
            checkout: {
              sessions: {
                create: jest.fn(),
              },
            },
          } as unknown as Partial<Stripe>,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                STRIPE_API_VERSION: '2020-08-27',
                STRIPE_PRICE_CURRENCY: 'eur',
                STRIPE_CHECKOUT_SESSION_PAYMENT_METHOD_TYPE_CARD: 'card',
                STRIPE_CHECKOUT_SESSION_MODE: 'payment',
                STRIPE_CHECKOUT_SESSION_SUCCCES_URL: 'http://success.url',
                STRIPE_CHECKOUT_SESSION_CANCEL_URL: 'http://cancel.url',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    stripeService = module.get<StripeService>(StripeService);
    stripe = module.get<Partial<Stripe>>('STRIPE');
  });

  const stripeProduct: Partial<Stripe.Product> = {
    id: 'prod_1',
    object: 'product',
    type: 'service',
    updated: 0,
    url: 'https://example.com/product',
    active: true,
    created: 1234567890,
    description: 'string',
    images: undefined,
    name: 'string',
    tax_code: 'string',
  };

  const mockProductResponse: Partial<Stripe.Response<Stripe.Product>> = {
    id: 'prod_1',
    object: 'product',
    active: true,
    created: 1234567890,
    description: 'string',
    images: ['http://image.url'],
    name: 'Test Product',
    type: 'service',
    lastResponse: {
      headers: {},
      requestId: 'req_123',
      statusCode: 200,
    },
  };

  const mockPriceResponse: Partial<Stripe.Response<Stripe.Price>> = {
    id: 'price_123',
    object: 'price',
    unit_amount: 1000,
    currency: 'usd',
    product: 'product_123',
    active: true,
    billing_scheme: 'per_unit',
    created: 1620000000,
    livemode: false,
    unit_amount_decimal: '1000',
  };

  const mockSession: Partial<Stripe.Response<Stripe.Checkout.Session>> = {
    id: 'cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u',
    object: 'checkout.session',
    after_expiration: null,
    allow_promotion_codes: null,
    amount_subtotal: 1000,
    amount_total: 1000,
    automatic_tax: {
      enabled: false,
      liability: null,
      status: null,
    },
    subscription: null,
    ui_mode: null,
    metadata: {},
    payment_method_configuration_details: null,
    payment_method_options: null,
    recovered_from: null,
    saved_payment_method_options: null,
    setup_intent: null,
    submit_type: null,
    custom_fields: [],
    custom_text: null,
    customer_email: null,
    invoice: null,
    invoice_creation: null,
    locale: null,
    client_secret: 'cs_test_secret',
    consent: null,
    consent_collection: null,
    currency_conversion: null,
    billing_address_collection: null,
    cancel_url: null,
    client_reference_id: null,
    created: 1679600215,
    currency: 'usd',
    customer_creation: 'if_required',
    livemode: false,
    mode: 'payment',
    payment_status: 'unpaid',
    success_url: 'https://example.com/success',
    url: 'https://checkout.stripe.com/c/pay/cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u#fidkdWxOYHwnPyd1blpxYHZxWjA0SDdPUW5JbmFMck1wMmx9N2BLZjFEfGRUNWhqTmJ%2FM2F8bUA2SDRySkFdUV81T1BSV0YxcWJcTUJcYW5rSzN3dzBLPUE0TzRKTTxzNFBjPWZEX1NKSkxpNTVjRjN8VHE0YicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
    expires_at: 1679686615,
    customer: null,
    customer_details: null,
    payment_intent: null,
    payment_link: null,
    payment_method_collection: 'always',
    payment_method_types: ['card'],
    phone_number_collection: {
      enabled: false,
    },
    shipping_address_collection: null,
    shipping_cost: null,
    shipping_details: null,
    shipping_options: [],
    status: 'open',
    total_details: {
      amount_discount: 0,
      amount_shipping: 0,
      amount_tax: 0,
    },
    lastResponse: {
      headers: {},
      requestId: 'req_123',
      statusCode: 200,
    },
  };

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const mockResponse: Partial<
        Stripe.Response<Stripe.ApiList<Stripe.Product>>
      > = {
        object: 'list',
        url: '/v1/products',
        has_more: false,
        data: [stripeProduct as Stripe.Product],
        lastResponse: {
          headers: {},
          requestId: 'req_123',
          statusCode: 200,
        },
      };
      jest
        .spyOn(stripe.products, 'list')
        .mockResolvedValue(
          mockResponse as Stripe.Response<Stripe.ApiList<Stripe.Product>>,
        );

      const products = await stripeService.getProducts();
      expect(products).toEqual([stripeProduct]);
      expect(stripe.products.list).toHaveBeenCalled();
    });

    it('should handle error when an exception occurs', async () => {
      jest
        .spyOn(stripe.products, 'list')
        .mockRejectedValue(new Error('Test error'));

      const loggerSpy = jest.spyOn(stripeService['logger'], 'error');

      await expect(stripeService.getProducts()).rejects.toThrowError(
        new StripeError('Test error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error retrieving products: Test error`,
        expect.anything(),
      );
    });
  });

  describe('createProduct', () => {
    it('should create a product and return it', async () => {
      jest
        .spyOn(stripe.products, 'create')
        .mockResolvedValue(
          mockProductResponse as Stripe.Response<Stripe.Product>,
        );
      jest
        .spyOn(stripe.prices, 'create')
        .mockResolvedValue(mockPriceResponse as Stripe.Response<Stripe.Price>);

      const product = await stripeService.createProduct({
        name: 'Test Product',
        description: 'Description',
        imageUrl: 'http://image.url',
        price: 1000,
      });
      expect(product).toEqual(mockProductResponse);
      expect(stripe.products.create).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Description',
        images: ['http://image.url'],
      });
      expect(stripe.prices.create).toHaveBeenCalled();
    });

    it('should handle error when an exception occurs creating a product', async () => {
      jest
        .spyOn(stripe.products, 'create')
        .mockRejectedValue(new Error('Test error'));

      const loggerSpy = jest.spyOn(stripeService['logger'], 'error');

      await expect(
        stripeService.createProduct({
          name: 'Test Product',
          description: 'Description',
          imageUrl: 'http://image.url',
          price: 1000,
        }),
      ).rejects.toThrowError(
        new StripeError('Test error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error creating product: Test error`,
        expect.anything(),
      );
    });

    it('should handle error when an exception occurs creating a price', async () => {
      jest
        .spyOn(stripe.products, 'create')
        .mockResolvedValue(
          mockProductResponse as Stripe.Response<Stripe.Product>,
        );
      jest
        .spyOn(stripe.prices, 'create')
        .mockRejectedValue(new Error('Test error'));

      const loggerSpy = jest.spyOn(stripeService['logger'], 'error');

      await expect(
        stripeService.createProduct({
          name: 'Test Product',
          description: 'Description',
          imageUrl: 'http://image.url',
          price: 1000,
        }),
      ).rejects.toThrowError(
        new StripeError('Test error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error creating product: Test error`,
        expect.anything(),
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return it', async () => {
      jest
        .spyOn(stripe.products, 'update')
        .mockResolvedValue(
          mockProductResponse as Stripe.Response<Stripe.Product>,
        );
      jest
        .spyOn(stripe.prices, 'create')
        .mockResolvedValue(mockPriceResponse as Stripe.Response<Stripe.Price>);

      const product = await stripeService.updateProduct('prod_1', {
        name: 'Updated Product',
        description: 'Updated Description',
        imageUrl: 'http://newimage.url',
        price: 2000,
      });
      expect(product).toEqual(mockProductResponse);
      expect(stripe.products.update).toHaveBeenCalledWith('prod_1', {
        name: 'Updated Product',
        description: 'Updated Description',
        images: ['http://newimage.url'],
      });
      expect(stripe.prices.create).toHaveBeenCalled();
    });

    it('should handle error when an exception occurs updating a product', async () => {
      jest
        .spyOn(stripe.products, 'update')
        .mockRejectedValue(new Error('Test error'));

      const loggerSpy = jest.spyOn(stripeService['logger'], 'error');

      await expect(
        stripeService.updateProduct('prod_1', {
          name: 'Updated Product',
          description: 'Updated Description',
          imageUrl: 'http://newimage.url',
          price: 2000,
        }),
      ).rejects.toThrowError(
        new StripeError('Test error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error updating product: Test error`,
        expect.anything(),
      );
    });

    it('should handle error when an exception occurs creating a price', async () => {
      jest
        .spyOn(stripe.products, 'update')
        .mockResolvedValue(
          mockProductResponse as Stripe.Response<Stripe.Product>,
        );
      jest
        .spyOn(stripe.prices, 'create')
        .mockRejectedValue(new Error('Test error'));

      const loggerSpy = jest.spyOn(stripeService['logger'], 'error');

      await expect(
        stripeService.updateProduct('prod_1', {
          name: 'Updated Product',
          description: 'Updated Description',
          imageUrl: 'http://newimage.url',
          price: 2000,
        }),
      ).rejects.toThrowError(
        new StripeError('Test error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error updating product: Test error`,
        expect.anything(),
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      jest.spyOn(stripe.products, 'del').mockResolvedValue(undefined);

      await stripeService.deleteProduct('prod_1');
      expect(stripe.products.update).toHaveBeenCalledWith('prod_1', {
        active: false,
      });
    });

    it('should handle error when an exception occurs deleting a product', async () => {
      jest
        .spyOn(stripe.products, 'update')
        .mockRejectedValue(new Error('Test error'));

      const loggerSpy = jest.spyOn(stripeService['logger'], 'error');

      await expect(stripeService.deleteProduct('prod_1')).rejects.toThrowError(
        new StripeError('Test error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error deleting product: Test error`,
        expect.anything(),
      );
    });
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session and return the session URL', async () => {
      jest
        .spyOn(stripe.checkout.sessions, 'create')
        .mockResolvedValue(
          mockSession as Stripe.Response<Stripe.Checkout.Session>,
        );

      const checkoutDto = new CheckoutDto([
        { paymentId: 'prod_1', amount: 2, price: 10.6 },
        { paymentId: 'prod_2', amount: 3, price: 10.6 },
      ]);

      const session = await stripeService.createCheckout(checkoutDto);
      expect(session).toEqual(mockSession);
      expect(session.url).toEqual(mockSession.url);
      expect(stripe.checkout.sessions.create).toHaveBeenCalled();
    });

    it('should handle error when an exception occurs creating a checkout session', async () => {
      jest
        .spyOn(stripe.checkout.sessions, 'create')
        .mockRejectedValue(new Error('Test error'));

      const loggerSpy = jest.spyOn(stripeService['logger'], 'error');

      const checkoutDto = new CheckoutDto([
        { paymentId: 'prod_1', amount: 2, price: 10.6 },
        { paymentId: 'prod_2', amount: 3, price: 10.6 },
      ]);

      await expect(
        stripeService.createCheckout(checkoutDto),
      ).rejects.toThrowError(
        new StripeError('Test error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error creating checkout session: Test error`,
        expect.anything(),
      );
    });
  });
});
