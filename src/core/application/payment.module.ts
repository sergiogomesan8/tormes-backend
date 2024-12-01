import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from '../domain/services/payment.service';
import { StripeModule } from '../../infraestructure/stripe/stripe.module';
import { CheckoutEntity } from 'src/infraestructure/postgres/entities/checkout.entity';

@Module({
  imports: [StripeModule.forRootAsync()],
  providers: [
    PaymentService,
    {
      provide: 'IPaymentService',
      useClass: PaymentService,
    },
  ],
  controllers: [],
  exports: ['IPaymentService'],
})
export class PaymentModule {}
