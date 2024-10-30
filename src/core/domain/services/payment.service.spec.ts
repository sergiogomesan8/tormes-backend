import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { StripeService } from '../../../infraestructure/stripe/stripe.service';
import { PaymentProduct } from '../models/payment.module';
import Stripe from 'stripe';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let stripeService: StripeService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: StripeService,
          useValue: {
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
        {
          provide: 'STRIPE_API_KEY',
          useValue: 'test_api_key',
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    stripeService = module.get<StripeService>(StripeService);
  });

  const paymentProduct: PaymentProduct = {
    name: 'producto1',
    description: 'descripcionProducto1',
    imageUrl: 'imageProducto1',
    price: 10,
  };

  const expectedProduct: PaymentProduct = {
    name: 'producto1',
    description: 'descripcionProducto1',
    imageUrl: 'imageProducto1',
    price: 1000,
  };

  const stripeProduct: Stripe.Product = {
    id: 'prod_1',
    object: 'product',
    type: 'service',
    updated: 0,
    url: 'https://example.com/product',
    active: true,
    created: 1234567890,
    description: 'descripcionProducto1',
    images: ['imageProducto1'],
    livemode: false,
    marketing_features: undefined,
    metadata: {},
    name: 'producto1',
    package_dimensions: undefined,
    shippable: false,
    tax_code: 'string',
  };

  describe('createProduct', () => {
    it('should create a product', async () => {
      jest
        .spyOn(stripeService, 'createProduct')
        .mockResolvedValue(stripeProduct);
      const result = await paymentService.createProduct(paymentProduct);
      expect(stripeService.createProduct).toHaveBeenLastCalledWith(
        expectedProduct,
      );
      expect(result).toEqual(stripeProduct);
    });

    it('should throw an error if createProduct fails', async () => {
      jest
        .spyOn(stripeService, 'createProduct')
        .mockRejectedValue(new Error('Error'));
      await expect(
        paymentService.createProduct(paymentProduct),
      ).rejects.toThrow('Error');
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      paymentProduct.price = 10;
      jest
        .spyOn(stripeService, 'updateProduct')
        .mockResolvedValue(stripeProduct);
      const result = await paymentService.updateProduct(
        stripeProduct.id,
        paymentProduct,
      );
      expect(stripeService.updateProduct).toHaveBeenLastCalledWith(
        stripeProduct.id,
        expectedProduct,
      );
      expect(result).toEqual(stripeProduct);
    });

    it('should throw an error if updateProduct fails', async () => {
      jest
        .spyOn(stripeService, 'updateProduct')
        .mockRejectedValue(new Error('Error'));
      await expect(
        paymentService.updateProduct(stripeProduct.id, paymentProduct),
      ).rejects.toThrow('Error');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      jest.spyOn(stripeService, 'deleteProduct').mockResolvedValue(undefined);
      await paymentService.deleteProduct(stripeProduct.id);
      expect(stripeService.deleteProduct).toHaveBeenCalledWith(
        stripeProduct.id,
      );
    });

    it('should throw an error if deleteProduct fails', async () => {
      jest
        .spyOn(stripeService, 'deleteProduct')
        .mockRejectedValue(new Error('Error'));
      await expect(
        paymentService.deleteProduct(stripeProduct.id),
      ).rejects.toThrow('Error');
    });
  });
});
