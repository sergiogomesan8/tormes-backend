import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
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
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/domain/services/jwt-config/access-token/access-jwt-auth.guard';
import { Request } from 'express';
import { CreateOrderDto } from '../dtos/order.dto';
import { CheckoutService } from 'src/core/domain/services/checkout.service';

@ApiTags('checkout')
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
@Controller('checkout')
export class CheckoutController {
  private readonly logger = new Logger(CheckoutController.name);

  constructor(private readonly checkoutService: CheckoutService) {}

  @ApiOperation({
    summary: 'Create an order, creating first a checkout',
    description: 'Endpoint to create an order, creating first a checkout',
  })
  @ApiCreatedResponse({
    description: 'Checkout created successfully',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createCheckout(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<any> {
    const user = req.user;
    const sessionUrl = await this.checkoutService.createCheckout(
      user['id'],
      createOrderDto,
    );
    return { sessionUrl: sessionUrl };
  }

  @Post('/webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ): Promise<void> {
    const payload = (req as any).rawBody;
    const event = await this.checkoutService.verifyWebhookSignature(
      payload,
      signature,
    );
    if (event) {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.checkoutService.successCheckout(event.data.object.id);
          break;
        case 'checkout.session.async_payment_failed':
          await this.checkoutService.failedCheckout(event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    }
  }
}
