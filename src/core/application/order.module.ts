import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../../infraestructure/api-rest/controllers/order.controller';
import { OrderEntity } from '../../infraestructure/postgres/entities/order.entity';
import { OrderService } from '../domain/services/order.service';
import { ProductModule } from './product.module';
import { UserModule } from './user.module';
import { PaymentModule } from './payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ProductModule,
    UserModule,
    PaymentModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
