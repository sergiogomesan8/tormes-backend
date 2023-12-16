import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IProductService } from '../ports/inbound/product.service.interface';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../../infraestructure/api-rest/dtos/product.dto';
import { Product } from '../models/product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../infraestructure/postgres/entities/product.entity';
import { QueryFailedError, Repository } from 'typeorm';

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
    const product = await this.productRepository.findOne({
      where: { id: id },
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Product with this name already exists');
      }
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updateResult = await this.productRepository.update(
      id,
      updateProductDto,
    );
    if (updateResult.affected === 0) {
      throw new NotFoundException('Product not found');
    }
    const updatedProduct = await this.productRepository.findOne({
      where: { id: id },
    });
    if (!updatedProduct) {
      throw new NotFoundException('Error retrieving updated product');
    }
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id: id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.delete(id);
    return { message: `Product with id ${id} was deleted.` };
  }
}
