import { PaymentProduct } from '../../models/payment.model';

export interface IPaymentService {
  createProduct(paymentProduct: PaymentProduct): Promise<any>;
  updateProduct(
    productId: string,
    paymentProduct: PaymentProduct,
  ): Promise<any>;
  deleteProduct(productId: string): Promise<void>;
}
