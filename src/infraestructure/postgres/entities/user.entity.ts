import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserType {
  customer = 1,
  employee = 2,
  manager = 3,
}

export enum NotificationPreference {
  email = 1,
  sms = 2,
}

export enum Gender {
  man = 1,
  women = 2,
  other = 3,
}

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
