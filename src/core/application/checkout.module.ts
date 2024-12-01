import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from '../../infraestructure/stripe/stripe.module';
import { ProductModule } from './product.module';
import { CheckoutEntity } from 'src/infraestructure/postgres/entities/checkout.entity';
import { OrderModule } from './order.module';
import { CheckoutService } from '../domain/services/checkout.service';
import { CheckoutController } from 'src/infraestructure/api-rest/controllers/checkout.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckoutEntity]),
    StripeModule.forRootAsync(),
    OrderModule,
    ProductModule,
  ],
  providers: [
    CheckoutService,
    {
      provide: 'ICheckoutService',
      useClass: CheckoutService,
    },
  ],
  controllers: [CheckoutController],
  exports: [],
})
export class CheckoutModule {}
