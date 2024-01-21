import { ConflictException, Injectable } from '@nestjs/common';
import { IEmployeeService } from '../ports/inbound/employee.service.interface';
import { CreateEmployeeDto } from 'src/infraestructure/api-rest/dtos/employee.dto';
import { Employee } from '../models/employee.model';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../../../infraestructure/postgres/entities/employee.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/infraestructure/api-rest/dtos/user.dto';

@Injectable()
export class EmployeeService implements IEmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private orderRepository: Repository<EmployeeEntity>,
    private readonly userService: UserService,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    try {
      const createUserDto: CreateUserDto = {
        email: createEmployeeDto.email,
        name: createEmployeeDto.name,
        password: createEmployeeDto.email,
      };
      const user = await this.userService.createUser(createUserDto);
      if (user) {
        const employee = this.orderRepository.create(createEmployeeDto);
        employee.user = user;

        await this.orderRepository.save(employee);
        return employee;
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(error.message);
      } else {
        throw error;
      }
    }
  }
}
