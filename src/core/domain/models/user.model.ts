import { Exclude } from 'class-transformer';

export interface User {
  id: string;

  email: string;
  password?: string;

  name: string;
  lastName: string;

  phoneNumber?: number;
  notificationPreference?: NotificationPreference;
  verifiedEmail?: boolean;
  verifiedPhoneNumber?: boolean;

  deliveryAddres?: string;
  billingAddres?: string;
  postalCode?: number;

  createdAt?: number;
  lastLogin?: number;

  birthdate?: number;
  gender?: Gender;

  userType?: UserType;
}

export class SerializedUser {
  id: string;

  email: string;

  @Exclude()
  password?: string;

  name: string;
  lastName: string;

  phoneNumber?: number;
  notificationPreference?: NotificationPreference;
  verifiedEmail?: boolean;
  verifiedPhoneNumber?: boolean;

  deliveryAddres?: string;
  billingAddres?: string;
  postalCode?: number;

  @Exclude()
  createdAt?: number;
  @Exclude()
  lastLogin?: number;

  birthdate?: number;
  gender?: Gender;

  userType?: UserType;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}

export enum UserType {
  customer = 'customer',
  employee = 'employee',
  manager = 'manager',
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
