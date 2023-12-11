import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../../infraestructure/api-rest/controllers/product.controller';
import { ProductService } from '../domain/services/product.service';
import { UserEntity } from '../../infraestructure/postgres/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
