import {
  OrderStatus,
  OrderedProduct,
} from '../../../core/domain/models/order.model';
import { User } from '../../../core/domain/models/user.model';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { randomBytes } from 'crypto';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;
  @BeforeInsert()
  generateOrderId() {
    const randomNum = parseInt(randomBytes(4).toString('hex'), 16);
    this.orderId = 'P' + randomNum.toString().padStart(9, '0').substring(0, 9);
  }

  @Column({ nullable: false })
  status: OrderStatus;

  @CreateDateColumn({ nullable: false })
  date: number;
  @Column({ type: 'double precision', nullable: false })
  total: number;
  @Column({ nullable: true })
  trackingNumber?: string;

  @ManyToOne(() => UserEntity)
  customer: User;
  @Column({ nullable: true })
  customerName?: string;
  @Column({ nullable: true })
  customerContact?: number;
  @Column({ nullable: true })
  deliveryAddress?: string;
  @Column({ nullable: true })
  billingAddress?: string;
  @Column({ nullable: true })
  paymentMethod?: string;

  @Column('json', { nullable: true })
  orderedProducts: OrderedProduct[];
}
