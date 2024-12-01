import { CheckoutDto } from 'src/infraestructure/api-rest/dtos/checkout.dto';
import { PaymentProduct } from '../../models/payment.model';

export interface IStripeService {
  createCheckout(checkoutDto: CheckoutDto): Promise<any>;
  createProduct(paymentProduct: PaymentProduct): Promise<any>;
  updateProduct(
    productId: string,
    paymentProduct: PaymentProduct,
  ): Promise<any>;
  deleteProduct(productId: string): Promise<void>;
}
