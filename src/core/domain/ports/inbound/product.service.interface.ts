import {
  CreateProductDto,
  UpdateProductDto,
} from '../../../../infraestructure/api-rest/dtos/product.dto';
import { Product } from '../../models/product.model';

export interface IProductService {
  findAllProducts(): Promise<Product[]>;
  findProductById(id: string): Promise<Product | null>;
  createProduct(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product>;
  updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File | null,
  ): Promise<Product | null>;
  deleteProduct(id: string);
}
