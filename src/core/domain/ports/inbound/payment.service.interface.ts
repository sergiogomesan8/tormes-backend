import { CheckoutDto } from "../../../../infraestructure/api-rest/dtos/checkout.dto";

export interface IPaymentService {
    getProducts(): Promise<any[]>;
    createProduct(name: string, description: string, imageUrl: string, unitAmount: number): Promise<any>;
    updateProduct(productId: string, name: string, description: string, imageUrl: string, unitAmount: number): Promise<any>;
    deleteProduct(productId: string): Promise<void>;
    createCheckoutSession(checkoutDto: CheckoutDto): Promise<string>;
}