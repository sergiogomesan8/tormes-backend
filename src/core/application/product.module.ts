import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../../infraestructure/api-rest/controllers/product.controller';
import { ProductService } from '../domain/services/product.service';
import { ProductEntity } from '../../infraestructure/postgres/entities/product.entity';
import { StripeModule } from '../../infraestructure/stripe/stripe.module';
import { CloudinaryModule } from '../../infraestructure/cloudinary-config/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CloudinaryModule, StripeModule.forRootAsync()],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
