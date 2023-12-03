import {
  Gender,
  NotificationPreference,
  UserType,
} from '../../../core/domain/models/user.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber?: number;

  @Column({
    type: 'enum',
    enum: NotificationPreference,
    nullable: true,
  })
  notificationPreference?: NotificationPreference;

  @Column({ default: false })
  verifiedEmail?: boolean;

  @Column({ default: false })
  verifiedPhoneNumber?: boolean;

  @Column({ nullable: true })
  deliveryAddress?: string;

  @Column({ nullable: true })
  billingAddress?: string;

  @Column({ nullable: true })
  postalCode?: number;

  @CreateDateColumn()
  createdAt?: number;

  @Column({ nullable: true })
  lastLogin?: number;

  @Column({ nullable: true })
  birthdate?: number;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: true,
  })
  userType?: UserType;
}
