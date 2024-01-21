import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from '../domain/services/employee.service';
import { EmployeeEntity } from '../../infraestructure/postgres/entities/employee.entity';
import { EmployeeController } from '../../infraestructure/api-rest/controllers/employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
