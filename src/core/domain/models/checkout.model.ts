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
