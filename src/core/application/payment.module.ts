import { Module } from '@nestjs/common';
import { PaymentService } from '../domain/services/payment.service';
import { StripeModule } from '../../infraestructure/stripe/stripe.module';

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
