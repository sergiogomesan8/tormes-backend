import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { CheckoutStatus } from 'src/core/domain/models/checkout.model';
import {
  OrderedProduct,
  ShoppingOrderedProduct,
} from 'src/core/domain/models/order.model';

@Entity({ name: 'checkouts' })
export class CheckoutEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => OrderEntity, (order) => order.checkout)
  order: OrderEntity;

  @Column({ type: 'double precision', nullable: false })
  total: number;
  @Column({ type: 'varchar', length: 3, nullable: false })
  currency: string;
  @Column({ type: 'bigint', nullable: false })
  createdAt: number;
  @Column({ nullable: false })
  status: CheckoutStatus;

  @Column({ nullable: false })
  userId: string;
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
  orderedProducts: ShoppingOrderedProduct[];

  @Column('json', { nullable: true })
  billingDetail: any;
  @Column({ unique: true })
  sessionId: string;
  @Column('json', { nullable: true })
  session: any;
}
