import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderedProductDto } from './order.dto';
import { PaymentOrderedProduct } from 'src/core/domain/models/payment.model';

export class PaymentDto {
  @ApiProperty({
    description: 'Ordered Products',
    example: [
      { productId: 'productId1', amount: 2, price: 10.6 },
      { productId: 'productId2', amount: 3, price: 10.6 },
    ],
    type: [OrderedProductDto],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PaymentProductDto)
  orderedProducts: PaymentOrderedProduct[];

  constructor(orderedProducts: PaymentOrderedProduct[]) {
    this.orderedProducts = orderedProducts;
  }
}

export class PaymentProductDto {
  @ApiProperty({
    description: 'Product payment ID',
    example: 'paymentId',
  })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({
    description: 'Amount of products',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Product price',
    example: 10.6,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(paymentId: string, amount: number, price: number) {
    this.paymentId = paymentId;
    this.amount = amount;
    this.price = price;
  }
}
