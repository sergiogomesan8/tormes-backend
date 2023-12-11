import { Injectable } from '@nestjs/common';
import { IProductService } from '../ports/inbound/product.service.interface';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../../infraestructure/api-rest/dtos/product.dto';
import { Product } from '../models/product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/infraestructure/postgres/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async findAllProducts(): Promise<Product[]> {
    const product = await this.productRepository.find();
    return product;
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: id } });
    return product;
  }

  createProduct(createProductDto: CreateProductDto): Product {
    const product = this.productRepository.create(createProductDto);
    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.findProductById(id);
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.findProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await this.productRepository.delete(id);
    return true;
  }
}
