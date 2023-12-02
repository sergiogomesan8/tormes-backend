import { Module } from '@nestjs/common';
import { AuthService } from '../domain/services/auth.service';
import { UserEntity } from 'src/infraestructure/postgres/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../domain/services/jwt-config/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '60s',
          },
        };
      },
    }),
    ConfigModule,
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
