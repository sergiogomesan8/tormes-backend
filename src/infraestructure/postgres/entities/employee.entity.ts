import { randomBytes } from 'crypto';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from '../../../core/domain/models/user.model';

@Entity({ name: 'employees' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  workerNumber: string;
  @BeforeInsert()
  generateOrderId() {
    const randomNum = parseInt(randomBytes(4).toString('hex'), 16);
    this.workerNumber =
      'P' + randomNum.toString().padStart(9, '0').substring(0, 9);
  }

  @Column({ nullable: false })
  job: string;
  @Column({ nullable: false })
  hireDate: number;
  @Column({ nullable: false })
  address: string;

  @ManyToOne(() => UserEntity)
  user: User;
}
