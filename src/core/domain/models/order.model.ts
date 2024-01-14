import { Product } from './product.model';
import { User } from './user.model';

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
  deliveryAddres?: string;
  billingAddress?: string;
  paymentMethod?: string;

  orderedProducts: OrderedProduct[];
}

export interface OrderedProduct {
  product: Product;
  amount: number;
}

export enum OrderStatus {
  processing = 1,
  shipped = 2,
  delayed = 3,
  delivered = 4,
  cancelled = 5,
}
