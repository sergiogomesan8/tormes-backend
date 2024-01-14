import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessTokenStrategy } from './access-jwt.strategy';
import { JwtAuthGuard } from './access-jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../infraestructure/postgres/entities/user.entity';
import { AccessJwtService } from './access-jwt.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'access-jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_ACCESS_TOKEN'),
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
    ConfigModule,
  ],
  providers: [JwtAccessTokenStrategy, JwtAuthGuard, AccessJwtService],
  exports: [AccessJwtService],
})
export class AccessTokenModule {}
