import {
  OrderStatus,
  OrderedProduct,
} from '../../../core/domain/models/order.model';
import { User } from '../../../core/domain/models/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  orderId: string;

  @Column({ nullable: false })
  status: OrderStatus;

  @CreateDateColumn({ nullable: false })
  date: number;
  @Column({ nullable: false })
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
