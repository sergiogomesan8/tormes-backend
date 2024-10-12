import { Module } from '@nestjs/common';
import { PaymentService } from '../domain/services/payment.service';
import { StripeModule } from '../../infraestructure/stripe/stripe.module';

@Module({
  imports: [StripeModule.forRootAsync()],
  providers: [
    {
      provide: 'IPaymentService',
      useClass: PaymentService,
    },
  ],
  exports: ['IPaymentService'],
})
export class PaymentModule {}
