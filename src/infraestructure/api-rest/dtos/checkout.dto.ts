import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CheckoutOrderedProduct } from '../../../core/domain/models/checkout.model';

export class CheckoutProductDto {
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

export class CheckoutDto {
  @ApiProperty({
    description: 'Ordered Products',
    example: [
      { paymentId: 'productId1', amount: 2, price: 10.6 },
      { paymentId: 'productId2', amount: 3, price: 10.6 },
    ],
    type: [CheckoutProductDto],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CheckoutProductDto)
  orderedProducts: CheckoutOrderedProduct[];

  constructor(orderedProducts: CheckoutOrderedProduct[]) {
    this.orderedProducts = orderedProducts;
  }
}
