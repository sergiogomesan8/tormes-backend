import { CreateProductDto } from '../../../../infraestructure/api-rest/dtos/product.dto';
import { Product } from '../../models/product.model';

export interface IProductService {
  findAll(): Promise<Product[]>;
  findOneById(id: string): Promise<Product | null>;
  create(createProductDto: CreateProductDto): Promise<Product | null>;
  //update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null>;
  delete(id: string): Promise<Product | null>;
}
