import { CheckoutDto } from './checkout.dto';
import { CheckoutOrderedProduct } from '../../../core/domain/models/checkout.model';

describe('CheckoutDto', () => {
  it('should create an instance of CheckoutDto', () => {
    const orderedProducts: CheckoutOrderedProduct[] = [
      { paymentId: 'productId1', amount: 2, price: 10.6 },
      { paymentId: 'productId2', amount: 3, price: 10.6 },
    ];
    const checkoutDto = new CheckoutDto(orderedProducts);
    expect(checkoutDto.orderedProducts).toEqual(orderedProducts);
  });
});
