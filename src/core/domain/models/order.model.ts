import { Type } from 'class-transformer';
import { Product } from './product.model';
import { SerializedUser, User } from './user.model';

export interface Order {
  id: string;
  orderId: string; //P123456789

  status: OrderStatus;

  date: number;
  total: number;
  trackingNumber?: string;

  customer: User;
  customerName?: string;
  customerContact?: number;
  deliveryAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;

  orderedProducts: OrderedProduct[];
}

export class SeralizedOrder {
  id: string;
  orderId: string;

  status: OrderStatus;

  date: number;
  total: number;
  trackingNumber?: string;

  @Type(() => SerializedUser)
  customer: SerializedUser;
  customerName?: string;
  customerContact?: number;
  deliveryAddres?: string;
  billingAddress?: string;
  paymentMethod?: string;

  orderedProducts: OrderedProduct[];

  constructor(partial: Partial<SeralizedOrder>) {
    Object.assign(this, partial);
  }
}

export interface OrderedProduct {
  productId: Product['id'];
  amount: number;
}

export enum OrderStatus {
  processing = 'processing',
  shipped = 'shipped',
  delayed = 'delayed',
  delivered = 'delivered',
  cancelled = 'cancelled',
}
