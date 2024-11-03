import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from '../domain/services/payment.service';
import { StripeModule } from '../../infraestructure/stripe/stripe.module';
import { PaymentController } from 'src/infraestructure/api-rest/controllers/payment.controller';
import { ProductModule } from './product.module';
import { CheckoutEntity } from 'src/infraestructure/postgres/entities/checkout.entity';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckoutEntity]),
    StripeModule.forRootAsync(),
  ],
  providers: [
    PaymentService,
    {
      provide: 'IPaymentService',
      useClass: PaymentService,
    },
  ],
  controllers: [PaymentController],
  exports: ['IPaymentService'],
})
export class PaymentModule {}
