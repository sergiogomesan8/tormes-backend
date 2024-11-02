import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../../infraestructure/api-rest/controllers/product.controller';
import { ProductService } from '../domain/services/product.service';
import { ProductEntity } from '../../infraestructure/postgres/entities/product.entity';
import { PaymentModule } from './payment.module';
import { ImageModule } from './image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ImageModule,
    forwardRef(() => PaymentModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
