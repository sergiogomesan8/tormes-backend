import { ApiProperty } from '@nestjs/swagger';
import { OrderedProduct } from '../../../core/domain/models/order.model';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderedProductDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'productId',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Amount of products',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  constructor(productId: string, amount: number) {
    this.productId = productId;
    this.amount = amount;
  }
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'Jhon Doe',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '1234567890',
  })
  @IsNumber()
  @IsNotEmpty()
  customerContact: number;

  @ApiProperty({
    description: 'Delivery Address',
    example: 'Street 123',
  })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({
    description: 'Billing Address',
    example: 'Street 123',
  })
  @IsString()
  @IsNotEmpty()
  billingAddress: string;

  @ApiProperty({
    description: 'Payment Method',
    example: 'Credit Card',
  })
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'Ordered Products',
    example: [
      { productId: 'productId1', amount: 2 },
      { productId: 'productId2', amount: 3 },
    ],
    type: [OrderedProductDto],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderedProductDto)
  orderedProducts: OrderedProduct[];

  constructor(
    customerName: string,
    customerContact: number,
    deliveryAddress: string,
    billingAddress: string,
    paymentMethod: string,
    orderedProducts: OrderedProduct[],
  ) {
    this.customerName = customerName;
    this.customerContact = customerContact;
    this.deliveryAddress = deliveryAddress;
    this.billingAddress = billingAddress;
    this.paymentMethod = paymentMethod;
    this.orderedProducts = orderedProducts;
  }
}
