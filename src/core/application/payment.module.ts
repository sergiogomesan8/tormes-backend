import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from '../domain/services/payment.service';
import { StripeModule } from '../../infraestructure/stripe/stripe.module';
import { PaymentController } from 'src/infraestructure/api-rest/controllers/payment.controller';
import { ProductModule } from './product.module';

@Module({
  imports: [StripeModule.forRootAsync(), forwardRef(() => ProductModule),],
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
