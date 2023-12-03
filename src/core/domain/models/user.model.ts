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
