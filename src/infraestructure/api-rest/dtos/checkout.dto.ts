import { ApiProperty } from '@nestjs/swagger';
import { ShoppingOrderedProduct } from '../../../core/domain/models/order.model';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderedProductDto } from './order.dto';

export class CheckoutDto {
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
  orderedProducts: ShoppingOrderedProduct[];

  constructor(orderedProducts: ShoppingOrderedProduct[]) {
    this.orderedProducts = orderedProducts;
  }
}
