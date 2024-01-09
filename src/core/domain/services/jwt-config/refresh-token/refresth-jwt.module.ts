import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthRefreshGuard } from './refresh-jwt-auth.guard';
import { JwtRefreshTokenStrategy } from './refresh-jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../infraestructure/postgres/entities/user.entity';
import { RefreshJwtService } from './refresh-jwt.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'refresh-jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_REFRESH_TOKEN'),
          signOptions: {
            expiresIn: '24h',
          },
        };
      },
    }),
    ConfigModule,
  ],
  providers: [JwtRefreshTokenStrategy, JwtAuthRefreshGuard, RefreshJwtService],
  exports: [RefreshJwtService],
})
export class RefreshTokenModule {}
