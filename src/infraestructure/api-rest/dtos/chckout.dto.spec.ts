import { CheckoutDto } from './checkout.dto';
import { ShoppingOrderedProduct } from '../../../core/domain/models/order.model';

describe('CheckoutDto', () => {
  it('should create an instance of CheckoutDto', () => {
    const orderedProducts: ShoppingOrderedProduct[] = [
      { productId: 'productId1', amount: 2 },
      { productId: 'productId2', amount: 3 },
    ];
    const checkoutDto = new CheckoutDto(orderedProducts);
    expect(checkoutDto.orderedProducts).toEqual(orderedProducts);
  });
});
