import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../../infraestructure/api-rest/controllers/product.controller';
import { ProductService } from '../domain/services/product.service';
import { ProductEntity } from '../../infraestructure/postgres/entities/product.entity';
import { CloudinaryModule } from '../../infraestructure/postgres/adapters/cloudinary-config/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
