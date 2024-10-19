import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

const STRIPE = 'STRIPE';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [ConfigModule.forRoot()],
      providers: [
        StripeService,
        {
          provide: STRIPE,
          useFactory: async (configService: ConfigService) => {
            const isDev = process.env.NODE_ENV === 'development';
            const apiKey = isDev
              ? process.env.STRIPE_TEST_API_KEY // Clave de prueba en desarrollo
              : configService.get('STRIPE_API_KEY'); // Clave de producción

            return new Stripe(apiKey, {
              apiVersion: configService.get('STRIPE_API_VERSION'),
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: [StripeService, STRIPE], // Exporta el servicio y el proveedor de Stripe
    };
  }
}
