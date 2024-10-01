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
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { StripeService } from '../../../infraestructure/stripe/stripe.service';
import { CloudinaryService } from '../../../infraestructure/cloudinary-config/cloudinary.service';
import * as fs from 'fs';
import { FileInterceptorSavePath } from '../../../infraestructure/api-rest/models/file-interceptor.model';
import Stripe from 'stripe';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private stripeService: StripeService,
    private readonly cloudinaryService: CloudinaryService,
    private dataSource: DataSource,
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

  async createProduct(createProductDto: CreateProductDto, file: Express.Multer.File): Promise<Product> {
    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      try {
        const image = await this.uploadImage(file);
        const stripeProduct = await this.createStripeProduct(createProductDto.name, createProductDto.description, createProductDto.price, image);

        const product = this.productRepository.create({
          ...createProductDto,
          image,
          paymentId: stripeProduct.id,
        });

        await transactionalEntityManager.save(product);
        return product;
      } catch (error) {
        if (error instanceof QueryFailedError) {
          throw new ConflictException('Product with this name already exists');
        }
        throw error;
      }
    });
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File | null,
  ): Promise<Product> {
    return await this.productRepository.manager.transaction(async (transactionalEntityManager) => {
      const existingProduct = await transactionalEntityManager.findOne(ProductEntity, { where: { id } });
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      let image = existingProduct.image;
      if (file) {
        await this.deleteImage(existingProduct.image);
        image = await this.uploadImage(file);
      }

      const updatedProductDto = { ...existingProduct, ...updateProductDto, image };
      const updateResult = await transactionalEntityManager.update(ProductEntity, id, updatedProductDto);
      if (updateResult.affected === 0) {
        throw new NotFoundException('Product not found');
      }

      const updatedProduct = await transactionalEntityManager.findOne(ProductEntity, { where: { id } });
      if (!updatedProduct) {
        throw new NotFoundException('Error retrieving updated product');
      }

      if (existingProduct.paymentId) {
        await this.updateStripeProduct(existingProduct.paymentId, updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.image);
      }

      return updatedProduct as Product;
    });
  }

  async deleteProduct(id: string) {
    return await this.productRepository.manager.transaction(async (transactionalEntityManager) => {
      const product = await transactionalEntityManager.findOne(ProductEntity, { where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.paymentId) {
        await this.deleteStripeProduct(product.paymentId);
      }

      const existingImage = product.image;
      if (existingImage) {
        await this.deleteImage(existingImage);
      }

      await transactionalEntityManager.delete(ProductEntity, id);
      return { message: `Product with id ${id} was deleted.` };
    });
  }

  private async createStripeProduct(name: string, description:string, price:number, imageUrl:string): Promise<Stripe.Product> {
    const unitAmount = price * 100;
    return await this.stripeService.createProduct(name, description, imageUrl, unitAmount);
  }

  private async deleteStripeProduct(stripeProductId: string): Promise<void> {
    await this.stripeService.deleteProduct(stripeProductId);
  }

  private async updateStripeProduct(stripeProductId: string, name: string, description: string, price: number, imageUrl: string): Promise<Stripe.Product> {
    const unitAmount = price * 100;
    return await this.stripeService.updateProduct(stripeProductId, name, description, imageUrl, unitAmount);
  }

  private async uploadImage(file: Express.Multer.File): Promise<string> {
    if (process.env.NODE_ENV === 'production') {
      const result = await this.cloudinaryService.uploadImage(file);
      return result.url as string;
    } else {
      return file.filename;
    }
  }

  private async deleteImage(image: string): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      await this.cloudinaryService.deleteImage(image);
    } else {
      const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
  }
}
