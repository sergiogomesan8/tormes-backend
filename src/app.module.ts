import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/application/auth.module';
import { UserModule } from './core/application/user.module';
import { ProductModule } from './core/application/product.module';
import { SectionModule } from './core/application/section.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './core/application/order.module';
import { PostgresConfigModule } from './infraestructure/postgres/adapters/postgres-config/postgres-config.module';
import { PostgreConfigService } from './infraestructure/postgres/adapters/postgres-config/postgres-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useClass: PostgreConfigService,
      inject: [PostgreConfigService],
    }),
    ...(process.env.NODE_ENV === 'development'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'tormes/assets/images/products'),
            serveRoot: '/tormes/images/products',
          }),
          ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'tormes/assets/images/sections'),
            serveRoot: '/tormes/images/sections',
          }),
        ]
      : []),
    AuthModule,
    UserModule,
    ProductModule,
    SectionModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
