import {
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IProductService } from '../ports/inbound/product.service.interface';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../../infraestructure/api-rest/dtos/product.dto';
import { Product } from '../models/product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../infraestructure/postgres/entities/product.entity';
import { Repository } from 'typeorm';
import { IPaymentService } from '../ports/inbound/payment.service.interface';
import { IImageService } from '../ports/inbound/image.service.interface';

@Injectable()
export class ProductService implements IProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject('IPaymentService')
    private readonly paymentService: IPaymentService,
    @Inject('IImageService')
    private readonly imageService: IImageService,
  ) {}

  async findAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.find();
    if (!products) {
      this.logger.error('Products not found');
    }
    return products;
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: id },
    });
    if (!product) {
      this.logger.error(`Product with ${id} not found`);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto, file: Express.Multer.File): Promise<Product> {
    try {
      const image = await this.imageService.uploadImage(file);

      const stripeProduct = await this.paymentService.createProduct(createProductDto.name, createProductDto.description, image, createProductDto.price, );

      const product = this.productRepository.create({
        ...createProductDto,
        image,
        paymentId: stripeProduct.id,
      });

      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`, error.stack);
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File | null,
  ): Promise<Product> {
    try{
      const existingProduct = await this.productRepository.findOne({
        where: { id: id },
      });
      let image: string;
      if (file) {
        await this.imageService.deleteImage(existingProduct.image);
        image = await this.imageService.uploadImage(file);
      }
      else{
        image = existingProduct.image;
      }

      await this.productRepository.update(
        id,
        {...updateProductDto, image}
      );

      await this.paymentService.updateProduct(
        id,
        updateProductDto.name,
        updateProductDto.description,
        image,
        updateProductDto.price,
      );

      const updatedProduct = await this.productRepository.findOne({
        where: { id: id },
      });
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Error updating product: ${error.message}`, error.stack);
    }
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id: id } });

    if(product){
      await this.imageService.deleteImage(product.image);
      await this.paymentService.deleteProduct(product.paymentId);
      await this.productRepository.delete(id);
      return { message: `Product with id ${id} was deleted.` };
    }
    else{
      this.logger.error(`Product with ${id} not found`);
    }
  }
}
