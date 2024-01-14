import { Product } from './product.model';
import { User } from './user.model';

export interface Order {
  id: string;
  orderId: string; //P123456789

  status: OrderStatus;

  date: number;
  total: number;
  deliveryAddres?: string;
  paymentMethod?: string;
  trackingNumber?: string;

  customer: User['id'];
  customerName?: string;
  customerContact?: string;

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
