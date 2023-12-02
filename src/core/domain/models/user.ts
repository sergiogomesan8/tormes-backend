export interface User {
  id: string;

  email: string;
  password?: string;

  name: Name;

  phoneNumber?: number;
  notificationPreference?: NotificationPreference;
  verifiedEmail?: boolean;
  verifiedPhoneNumber?: boolean;

  deliveryAddres?: string;
  billingAddres?: string;

  createdAt?: number;
  firstLogin?: number;

  birthdate?: number;
  gender?: string;

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

export interface Name {
  name: string;
  lastName: string;
}

export type CustomDecodedTokenType = {
  email?: string;
  uid: string;
};
