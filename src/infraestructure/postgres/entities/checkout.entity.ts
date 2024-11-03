import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { CheckoutStatus } from 'src/core/domain/models/checkout.model';

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

  @Column('json', { nullable: true })
  billingDetail: any;
  @Column({ unique: true })
  sessionId: string;
}
