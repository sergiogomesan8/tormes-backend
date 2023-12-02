import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresConfigModule } from './infraestructure/postgres/config/postgres-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreConfigService } from './infraestructure/postgres/config/postgres-config.service';
import { UserModule } from './core/application/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useClass: PostgreConfigService,
      inject: [PostgreConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
