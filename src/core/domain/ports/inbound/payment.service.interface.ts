import { PaymentProduct } from "../../models/payment.module";

export interface IPaymentService {
  createProduct(paymentProduct: PaymentProduct): Promise<any>;
  updateProduct(
    productId: string,
    paymentProduct: PaymentProduct,
  ): Promise<any>;
  deleteProduct(productId: string): Promise<void>;
}
