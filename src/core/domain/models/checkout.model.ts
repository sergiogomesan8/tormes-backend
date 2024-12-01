import { Order, ShoppingOrderedProduct } from './order.model';
import { Product } from './product.model';

export interface CheckoutOrderedProduct {
  paymentId: Product['paymentId'];
  amount: number;
  price: number;
}

export enum CheckoutStatus {
  pending = 'pending',
  successfull = 'successfull',
  failed = 'failed',
  cancelled = 'cancelled',
  refunded = 'refunded',
}

export interface Checkout {
  id: string;

  order: Order;

  total: number;
  currency: string;
  createdAt: number;
  status: CheckoutStatus;

  userId: string;
  customerName?: string;
  customerContact?: number;
  deliveryAddress?: string;
  billingAddress?: string;
  paymentMethod?: string;

  billingDetail: any;
  sessionId: string;
  session: any;

  orderedProducts: ShoppingOrderedProduct[];
}
