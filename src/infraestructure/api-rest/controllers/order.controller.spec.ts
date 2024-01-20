import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from '../../../core/domain/services/order.service';
import {
  Order,
  OrderStatus,
  SeralizedOrder,
} from '../../../core/domain/models/order.model';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dtos/order.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { SerializedUser, User } from '../../../core/domain/models/user.model';
import { plainToClass } from 'class-transformer';
import { Product } from 'src/core/domain/models/product.model';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            findAllOrders: jest.fn(),
            findOrderById: jest.fn(),
            findAllOrdersByUser: jest.fn(),
            createOrder: jest.fn(),
            updateOrderStatus: jest.fn(),
            deleteOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  const product1: Product = {
    id: expect.any(String),
    name: 'Product 1',
    price: 100,
    description: 'Product 1 description',
    image: 'filename',
    section: 'section1',
  };

  const product2: Product = {
    id: expect.any(String),
    name: 'Product 2',
    price: 200,
    description: 'Product 2 description',
    image: 'filename',
    section: 'section2',
  };

  const email = 'user@example.com';
  const customerName = 'John Doe';
  const customerContact = 1234567890;
  const deliveryAddress = 'Street 123';
  const billingAddress = 'Street 123';
  const paymentMethod = 'Credit Card';
  const orderedProducts = [
    { product: product1, amount: 2 },
    { product: product2, amount: 3 },
  ];
  const status = OrderStatus.processing;
  const user = { id: 'userId', name: 'Test User', email } as User;

  const shoppingOrderedProducts = [
    { productId: 'productId1', amount: 2 },
    { productId: 'productId2', amount: 3 },
  ];

  const order: Order = {
    id: 'id-123',
    customerName,
    customerContact,
    deliveryAddress,
    billingAddress,
    paymentMethod,
    orderedProducts,
    orderId: 'P987654321',
    status,
    date: 0,
    total: 200,
    customer: plainToClass(SerializedUser, user),
  };
  const expectedResponse = new SeralizedOrder(order);

  const createOrderDto = new CreateOrderDto(
    customerName,
    customerContact,
    deliveryAddress,
    billingAddress,
    paymentMethod,
    shoppingOrderedProducts,
  );

  const updateOrderStatusDto = new UpdateOrderStatusDto(OrderStatus.delivered);

  describe('findAllOrders', () => {
    it('should return an array of orders', async () => {
      jest.spyOn(orderService, 'findAllOrders').mockResolvedValue([order]);
      expect(await orderController.findAllOrders()).toEqual([expectedResponse]);
      expect(orderService.findAllOrders).toHaveBeenCalled();
    });

    it('should return an empty array if no order are found', async () => {
      jest.spyOn(orderService, 'findAllOrders').mockResolvedValue([]);
      expect(await orderController.findAllOrders()).toEqual([]);
      expect(orderService.findAllOrders).toHaveBeenCalled();
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(orderService, 'findAllOrders')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(orderController.findAllOrders()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOrderById', () => {
    it('should return an order by id', async () => {
      jest.spyOn(orderService, 'findOrderById').mockResolvedValue(order);
      expect(await orderController.findOrderById(expect.any(String))).toEqual(
        expectedResponse,
      );
      expect(orderService.findOrderById).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should return a NotFoundException if order was not found', () => {
      jest
        .spyOn(orderService, 'findOrderById')
        .mockRejectedValue(new NotFoundException());

      return expect(
        orderController.findOrderById(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(orderService, 'findOrderById')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        orderController.findOrderById(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAllOrdersByUser', () => {
    it('should return an array of orders for a specific user', async () => {
      const req: Partial<Request> = { user: { id: 'userId', email: email } };
      jest
        .spyOn(orderService, 'findAllOrdersByUser')
        .mockResolvedValue([order]);

      expect(await orderController.findAllOrdersByUser(req as Request)).toEqual(
        [expectedResponse],
      );
      expect(orderService.findAllOrdersByUser).toHaveBeenCalledWith('userId');
    });

    it('should return an empty array if the user has no orders', async () => {
      const req: Partial<Request> = { user: { id: 'userId', email: email } };
      jest.spyOn(orderService, 'findAllOrdersByUser').mockResolvedValue([]);

      expect(await orderController.findAllOrdersByUser(req as Request)).toEqual(
        [],
      );
      expect(orderService.findAllOrdersByUser).toHaveBeenCalledWith('userId');
    });

    it('should return an Http Exception error when it happens', () => {
      const req: Partial<Request> = { user: { id: 'userId', email: email } };
      jest
        .spyOn(orderService, 'findAllOrdersByUser')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        orderController.findAllOrdersByUser(req as Request),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const req: Partial<Request> = { user: { id: 'userId', email: email } };
      jest.spyOn(orderService, 'createOrder').mockResolvedValue(order);

      expect(
        await orderController.createOrder(req as Request, createOrderDto),
      ).toEqual(expectedResponse);
      expect(orderService.createOrder).toHaveBeenCalledWith(
        'userId',
        createOrderDto,
      );
    });

    it('should return an Http Exception error when it happens', () => {
      const req: Partial<Request> = { user: { id: 'userId', email: email } };
      jest
        .spyOn(orderService, 'createOrder')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        orderController.createOrder(req as Request, createOrderDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update an order', async () => {
      jest.spyOn(orderService, 'findOrderById').mockResolvedValue(order);
      jest.spyOn(orderService, 'updateOrderStatus').mockResolvedValue(order);

      expect(
        await orderController.updateOrderStatus(
          expect.any(String),
          updateOrderStatusDto,
        ),
      ).toEqual(expectedResponse);
      expect(orderService.updateOrderStatus).toHaveBeenCalledWith(
        expect.any(String),
        { status: OrderStatus.delivered },
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest.spyOn(orderService, 'findOrderById').mockResolvedValue(order);
      jest
        .spyOn(orderService, 'updateOrderStatus')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        orderController.updateOrderStatus(expect.any(String), {
          status: OrderStatus.delivered,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      jest.spyOn(orderService, 'findOrderById').mockResolvedValue(order);
      jest.spyOn(orderService, 'deleteOrder').mockResolvedValue({
        message: `Order with id ${expect.any(String)} was deleted.`,
      });

      expect(await orderController.deleteOrder(expect.any(String))).toEqual({
        message: `Order with id ${expect.any(String)} was deleted.`,
      });
      expect(orderService.deleteOrder).toHaveBeenCalledWith(expect.any(String));
    });

    it('should return an Http Exception error when it happens', () => {
      jest.spyOn(orderService, 'findOrderById').mockResolvedValue(order);
      jest
        .spyOn(orderService, 'deleteOrder')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        orderController.deleteOrder(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
