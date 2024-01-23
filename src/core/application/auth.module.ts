import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService } from '../domain/services/auth.service';
import { UserEntity } from '../../infraestructure/postgres/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../../infraestructure/api-rest/controllers/auth.controller';
import { UserService } from '../domain/services/user.service';
import { RolesGuard } from '../domain/services/roles-authorization/roles.guard';
import { RefreshTokenModule } from '../domain/services/jwt-config/refresh-token/refresth-jwt.module';
import { AccessTokenModule } from '../domain/services/jwt-config/access-token/access-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AccessTokenModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, RolesGuard],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}
  onModuleInit() {
    this.registerAdminUser();
  }

  async registerAdminUser() {
    await this.authService.registerAdminUser({
      name: process.env.ADMIN_USER_EMAIL,
      email: process.env.ADMIN_USER_EMAIL,
      password: process.env.ADMIN_USER_PASSWORD,
    });
  }
}
