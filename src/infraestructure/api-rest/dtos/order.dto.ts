import { ApiProperty } from '@nestjs/swagger';
import { OrderedProduct } from '../../../core/domain/models/order.model';
import { IsNotEmpty, IsString } from 'class-validator';

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
  customerContact: number;

  @ApiProperty({
    description: 'Delivery Address',
    example: 'Street 123',
  })
  @IsString()
  @IsNotEmpty()
  deliveryAddres: string;

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
  paymentMethod: string;

  orderedProducts: OrderedProduct[];
}
