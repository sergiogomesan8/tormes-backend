import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../../infraestructure/api-rest/controllers/product.controller';
import { ProductService } from '../domain/services/product.service';
import { ProductEntity } from '../../infraestructure/postgres/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
