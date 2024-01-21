import { User } from './user.model';

export interface Employee extends User {
  workerNumber: string;
  job: string;
  hireDate: number;
  address: string;
}
