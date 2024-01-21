import { CreateEmployeeDto } from '../../../../infraestructure/api-rest/dtos/employee.dto';
import { Employee } from '../../models/employee.model';

export interface IEmployeeService {
  createEmployee(employee: CreateEmployeeDto): Promise<Employee>;
}
