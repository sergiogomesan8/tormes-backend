import { OrderEntity } from '../../../infraestructure/postgres/entities/order.entity';
import { OrderService } from './order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../models/user.model';
import { OrderStatus } from '../models/order.model';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
} from '../../../infraestructure/api-rest/dtos/order.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import { UserEntity } from '../../../infraestructure/postgres/entities/user.entity';
import { ProductEntity } from '../../../infraestructure/postgres/entities/product.entity';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Repository<OrderEntity>;
  let productService: ProductService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useClass: Repository,
        },
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            findProductById: jest.fn(),
          },
        },
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
    productService = module.get<ProductService>(ProductService);
    userService = module.get<UserService>(UserService);
  });

  const email = 'user@example.com';
  const customerName = 'John Doe';
  const customerContact = 1234567890;
  const deliveryAddress = 'Street 123';
  const billingAddress = 'Street 123';
  const paymentMethod = 'Credit Card';
  const orderedProducts = [
    { productId: 'productId1', amount: 2 },
    { productId: 'productId2', amount: 3 },
  ];
  const status = OrderStatus.processing;

  const user = { id: 'userId', name: 'Test User', email } as User;

  const order = {
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
    customer: user,
    generateOrderId: () => {},
  };

  const mockProduct = {
    id: expect.any(String),
    name: 'Product Name',
    description: 'Product Description',
    image: 'Product Image',
    section: 'Product Section',
    price: 100,
  };

  const createOrderDto = new CreateOrderDto(
    customerName,
    customerContact,
    deliveryAddress,
    billingAddress,
    paymentMethod,
    orderedProducts,
  );

  const updateOrderStatusDto = new UpdateOrderStatusDto(OrderStatus.delivered);

  describe('findAllOrders', () => {
    it('should return all orders', async () => {
      jest.spyOn(orderRepository, 'find').mockResolvedValue([order]);

      const orders = await orderService.findAllOrders();
      expect(orders).toEqual([order]);
      expect(orderRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no orders are found', async () => {
      jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

      const orders = await orderService.findAllOrders();
      expect(orders).toEqual([]);
      expect(orderRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(orderRepository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(orderService.findAllOrders()).rejects.toThrow(
        'Database error',
      );
      expect(orderRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOrderById', () => {
    it('should return order with the id', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);

      const result = await orderService.findOrderById(expect.any(String));
      expect(result).toEqual(order);
      expect(orderRepository.findOne).toHaveBeenCalled();
    });

    it('should return NotFoundException when order does not exists', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        orderService.findOrderById(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
      expect(orderRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(orderRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        orderService.findOrderById(expect.any(String)),
      ).rejects.toThrow('Database error');
      expect(orderRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error when it happens', async () => {
      jest.spyOn(orderRepository, 'findOne').mockRejectedValue(new Error());

      await expect(
        orderService.findOrderById(expect.any(String)),
      ).rejects.toThrow(Error);
      expect(orderRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findAllOrdersByUser', () => {
    it('should return all orders for a given user', async () => {
      const userId = 'userId';
      const ordersForUser = [order];
      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ordersForUser),
      } as any);

      const result = await orderService.findAllOrdersByUser(userId);
      expect(result).toEqual(ordersForUser);
    });

    it('should return an empty array if no orders are found for the user', async () => {
      const userId = 'userId';
      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await orderService.findAllOrdersByUser(userId);
      expect(result).toEqual([]);
    });

    it('should throw an error if the database query fails', async () => {
      const userId = 'userId';
      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Database error')),
      } as any);

      await expect(orderService.findAllOrdersByUser(userId)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('createOrder', () => {
    it('should create an order for a given user and return it', async () => {
      const userId = 'userId';
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest.spyOn(orderRepository, 'create').mockReturnValue(order);
      jest
        .spyOn(productService, 'findProductById')
        .mockResolvedValue(mockProduct);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(order);

      const result = await orderService.createOrder(userId, createOrderDto);
      expect(result).toEqual(order);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      const userId = 'userId';
      jest.spyOn(userService, 'findUserById').mockResolvedValue(undefined);

      await expect(
        orderService.createOrder(userId, createOrderDto),
      ).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });

    it('should throw a ConflictException if the database query fails', async () => {
      const userId = 'userId';
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest.spyOn(orderRepository, 'create').mockReturnValue(order);
      jest
        .spyOn(productService, 'findProductById')
        .mockResolvedValue(mockProduct);
      const errorMessage = 'query error';
      jest.spyOn(orderRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('query', [], new Error(errorMessage));
      });
      await expect(
        orderService.createOrder(userId, createOrderDto),
      ).rejects.toThrow(new ConflictException(errorMessage));
    });

    it('should throw an error if save fails', async () => {
      const userId = 'userId';
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      jest.spyOn(orderRepository, 'create').mockReturnValue(order);
      jest
        .spyOn(productService, 'findProductById')
        .mockResolvedValue(mockProduct);
      jest.spyOn(orderRepository, 'save').mockImplementation(() => {
        throw new Error('Save error');
      });

      try {
        await orderService.createOrder(userId, createOrderDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Save error');
      }
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the status of an order and return it', async () => {
      const id = 'id-123';
      const status = OrderStatus.delivered;

      jest
        .spyOn(orderRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);

      const updatedOrder = await orderService.updateOrderStatus(
        id,
        updateOrderStatusDto,
      );

      expect(updatedOrder).toEqual(order);
      expect(orderRepository.update).toHaveBeenCalledWith(id, { status });
      expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw a NotFoundException if the order is not found', async () => {
      const id = 'id-123';
      const status = OrderStatus.delivered;

      jest
        .spyOn(orderRepository, 'update')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        orderService.updateOrderStatus(id, updateOrderStatusDto),
      ).rejects.toThrow(new NotFoundException('Order not found'));
      expect(orderRepository.update).toHaveBeenCalledWith(id, { status });
    });

    it('should throw a NotFoundException if there is an error retrieving the updated order', async () => {
      const id = 'id-123';
      const status = OrderStatus.delivered;

      jest
        .spyOn(orderRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        orderService.updateOrderStatus(id, updateOrderStatusDto),
      ).rejects.toThrow(
        new NotFoundException('Error retrieving updated product'),
      );
      expect(orderRepository.update).toHaveBeenCalledWith(id, { status });
      expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('deleteOrder', () => {
    it('should delete a order when order exists', async () => {
      const orderId = 'id-123';
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);
      jest
        .spyOn(orderRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await orderService.deleteOrder(orderId);
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
      });
      expect(orderRepository.delete).toHaveBeenCalledWith(orderId);
      expect(result).toEqual({
        message: `Order with id ${orderId} was deleted.`,
      });
    });

    it('should throw NotFoundException when order does not exist', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(undefined);
      await expect(orderService.deleteOrder('order-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error on findOne method when it happens', async () => {
      jest.spyOn(orderRepository, 'findOne').mockRejectedValue(new Error());
      await expect(orderService.deleteOrder('order-id')).rejects.toThrow(Error);
      expect(orderRepository.findOne).toHaveBeenCalled();
    });

    it('should throw error when delete method throws an error', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);
      jest.spyOn(orderRepository, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await expect(orderService.deleteOrder('order-id')).rejects.toThrow(
        'Error',
      );
    });
  });
});
