import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresConfigModule } from './infraestructure/postgres/config/postgres-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreConfigService } from './infraestructure/postgres/config/postgres-config.service';
import { AuthModule } from './core/application/auth.module';
import { UserModule } from './core/application/user.module';
import { ProductModule } from './core/application/product.module';
import { SectionModule } from './core/application/section.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './core/application/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useClass: PostgreConfigService,
      inject: [PostgreConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'tormes/assets/images/products'),
      serveRoot: '/tormes/images/products',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'tormes/assets/images/sections'),
      serveRoot: '/tormes/images/sections',
    }),
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
