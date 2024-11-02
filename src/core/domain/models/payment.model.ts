import { Product } from './product.model';

export interface PaymentProduct {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

export interface PaymentOrderedProduct {
  paymentId: Product['paymentId'];
  amount: number;
  price: number;
}
