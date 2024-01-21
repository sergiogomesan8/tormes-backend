export interface CashRegister {
  id: string;
  date: number;
  coins: Coin;
  bills: Bill;

  totalCardPayments: number;
  totalSpent: number;
  cashInBox: number;

  total: number;
}

export interface Coin {
  oneCent: number;
  twoCent: number;
  fiveCent: number;
  tenCent: number;
  twentyCent: number;
  fiftyCent: number;
  oneEuro: number;
  twoEuro: number;
}

export interface Bill {
  fiveEuro: number;
  tenEuro: number;
  twentyEuro: number;
  fiftyEuro: number;
  hundredEuro: number;
}
