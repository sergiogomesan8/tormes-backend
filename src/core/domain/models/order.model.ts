import { Type } from 'class-transformer';
import { Product } from './product.model';
import { SerializedUser, User } from './user.model';
import { Checkout } from './checkout.model';

export interface Order {
  id: string;
  orderId: string; //P123456789

  checkout: Checkout;

  status: OrderStatus;

  date: number;
  total: number;

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
  product: Product;
  amount: number;
}

export interface ShoppingOrderedProduct {
  productId: Product['id'];
  amount: number;
}

export enum OrderStatus {
  payment_pending = 'payment_pending',
  processing = 'processing',
  shipped = 'shipped',
  delayed = 'delayed',
  delivered = 'delivered',
  cancelled = 'cancelled',
}
