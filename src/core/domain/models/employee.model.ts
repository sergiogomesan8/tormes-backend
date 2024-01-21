import { User } from './user.model';

export interface Employee {
  workerNumber: string;
  job: string;
  hireDate: number;
  address: string;

  user: User;
}
