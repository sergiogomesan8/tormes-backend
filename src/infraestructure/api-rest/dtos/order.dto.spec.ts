import { OrderStatus } from '../../../core/domain/models/order.model';
import {
  CreateOrderDto,
  OrderedProductDto,
  UpdateOrderStatusDto,
} from './order.dto';

describe('CreateOrderDto', () => {
  it('should create a CreateOrderDto object', () => {
    const customerName = 'John Doe';
    const customerContact = 1234567890;
    const deliveryAddress = 'Street 123';
    const billingAddress = 'Street 123';
    const paymentMethod = 'Credit Card';
    const orderedProducts = [
      { productId: 'productId1', amount: 2 },
      { productId: 'productId2', amount: 3 },
    ];

    const createOrderDto = new CreateOrderDto(
      customerName,
      customerContact,
      deliveryAddress,
      billingAddress,
      paymentMethod,
      orderedProducts,
    );

    expect(createOrderDto).toBeDefined();
    expect(createOrderDto.customerName).toBe(customerName);
    expect(createOrderDto.customerContact).toBe(customerContact);
    expect(createOrderDto.deliveryAddress).toBe(deliveryAddress);
    expect(createOrderDto.billingAddress).toBe(billingAddress);
    expect(createOrderDto.paymentMethod).toBe(paymentMethod);
    expect(createOrderDto.orderedProducts).toEqual(orderedProducts);
  });
});

describe('OrderedProductDto', () => {
  it('should create a OrderedProductDto object', () => {
    const productId = 'productId';
    const amount = 2;

    const orderedProductDto = new OrderedProductDto(productId, amount);

    expect(orderedProductDto).toBeDefined();
    expect(orderedProductDto.productId).toBe(productId);
    expect(orderedProductDto.amount).toBe(amount);
  });
});

describe('UpdateOrderStatusDto', () => {
  it('should create a UpdateOrderStatusDto object', () => {
    const status = OrderStatus.processing;

    const updateOrderStatusDto = new UpdateOrderStatusDto(status);

    expect(updateOrderStatusDto).toBeDefined();
    expect(updateOrderStatusDto.status).toBe(status);
  });
});
