import { Module } from '@nestjs/common';
import { UserController } from '../../infraestructure/api-rest/controllers/user.controller';
import { UserService } from '../domain/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../infraestructure/postgres/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
