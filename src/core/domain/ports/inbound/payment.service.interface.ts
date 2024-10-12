export interface IPaymentService {
  createProduct(
    name: string,
    description: string,
    imageUrl: string,
    unitAmount: number,
  ): Promise<any>;
  updateProduct(
    productId: string,
    name: string,
    description: string,
    imageUrl: string,
    unitAmount: number,
  ): Promise<any>;
  deleteProduct(productId: string): Promise<void>;
}
