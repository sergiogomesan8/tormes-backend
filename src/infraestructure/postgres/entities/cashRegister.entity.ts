import { Bill, Coin } from '../../../core/domain/models/cashRegister.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  date: number;

  @Column({ nullable: false })
  coins: Coin;
  @Column({ nullable: false })
  bills: Bill;

  @Column({ nullable: false })
  totalCardPayments: number;
  @Column({ nullable: false })
  totalSpent: number;
  @Column({ nullable: false })
  cashInBox: number;

  @Column({ nullable: false })
  total: number;
}
