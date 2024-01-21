import { Bills, Coins } from '../../../core/domain/models/cashRegister.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cash-registers' })
export class CashRegisterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  date: number;

  @Column({ type: 'json', nullable: false })
  coins: Coins;
  @Column({ type: 'json', nullable: false })
  bills: Bills;

  @Column({ type: 'double precision', nullable: false })
  totalCoinPayments: number;
  @Column({ nullable: false })
  totalBillPayments: number;
  @Column({ type: 'double precision', nullable: false })
  totalCardPayments: number;
  @Column({ type: 'double precision', nullable: false })
  totalSpent: number;
  @Column({ type: 'double precision', nullable: false })
  cashInBox: number;

  @Column({ type: 'double precision', nullable: false })
  reportedTotal: number;
  @Column({ type: 'double precision', nullable: false })
  calculatedTotal: number;
}
