import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import {
  Controller,
  UseFilters,
  Get,
  Res,
  Req,
  RawBodyRequest,
  Post,
  Body,
  Headers,
  Logger,
} from '@nestjs/common';
import { PaymentService } from 'src/core/domain/services/payment.service';
import { StripeService } from 'src/infraestructure/stripe/stripe.service';

@ApiTags('payment')
@ApiBearerAuth()
@ApiNoContentResponse({ description: 'No content.' })
@ApiBadRequestResponse({ description: 'Bad request. Invalid data provided.' })
@ApiUnauthorizedResponse({
  description: 'Unauthorized. User authentication failed.',
})
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiNotFoundResponse({
  description: 'Not found. The specified ID does not exist.',
})
@ApiInternalServerErrorResponse({ description: 'Internet Server Error.' })
@UseFilters(new HttpExceptionFilter())
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('/webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ): Promise<void> {
    const payload = (req as any).rawBody;
    this.logger.verbose("payload", payload)
    const event = await this.stripeService.verifyWebhookSignature(
      payload,
      signature,
    );

    if (event) {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.paymentService.successPayment(event.data.object.id);
          break;
        case 'checkout.session.async_payment_failed':
          await this.paymentService.failedPayment(event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    }
  }
}
