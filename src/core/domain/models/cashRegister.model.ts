import { User } from './user.model';

export interface CashRegister {
  id: string;
  date: number;

  coins: Coins;
  bills: Bills;

  totalCoinPayments: number;
  totalBillPayments: number;
  totalCardPayments: number;
  totalSpent: number;
  cashInBox: number;

  reportedTotal: number;
  calculatedTotal: number;

  employee: User;
}

export interface Coins {
  oneCent: number;
  twoCent: number;
  fiveCent: number;
  tenCent: number;
  twentyCent: number;
  fiftyCent: number;
  oneEuro: number;
  twoEuro: number;
}

export interface Bills {
  fiveEuro: number;
  tenEuro: number;
  twentyEuro: number;
  fiftyEuro: number;
  hundredEuro: number;
}

export enum CoinValue {
  oneCent = 0.01,
  twoCent = 0.02,
  fiveCent = 0.05,
  tenCent = 0.1,
  twentyCent = 0.2,
  fiftyCent = 0.5,
  oneEuro = 1.0,
  twoEuro = 2.0,
}

export enum BillValue {
  fiveEuro = 5.0,
  tenEuro = 10.0,
  twentyEuro = 20.0,
  fiftyEuro = 50.0,
  hundredEuro = 100.0,
}
