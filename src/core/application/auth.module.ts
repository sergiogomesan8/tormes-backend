import { Module } from '@nestjs/common';
import { AuthService } from '../domain/services/auth.service';
import { UserEntity } from '../../infraestructure/postgres/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../domain/services/jwt-config/jwt.strategy';
import { AuthController } from '../../infraestructure/api-rest/controllers/auth.controller';
import { UserService } from '../domain/services/user.service';

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
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
