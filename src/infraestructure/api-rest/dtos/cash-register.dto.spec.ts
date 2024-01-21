import { CoinsDto, BillsDto, CreateCashRegisterDto } from './cash-register.dto';

describe('CoinsDto', () => {
  it('should create a CoinsDto object', () => {
    const coin = new CoinsDto(1, 2, 3, 4, 5, 6, 7, 8);
    expect(coin).toBeInstanceOf(CoinsDto);
    expect(coin.oneCent).toBe(1);
    expect(coin.twoCent).toBe(2);
    expect(coin.fiveCent).toBe(3);
    expect(coin.tenCent).toBe(4);
    expect(coin.twentyCent).toBe(5);
    expect(coin.fiftyCent).toBe(6);
    expect(coin.oneEuro).toBe(7);
    expect(coin.twoEuro).toBe(8);
  });
});

describe('BillsDto', () => {
  it('should create a BillsDto object', () => {
    const bill = new BillsDto(5, 10, 20, 50, 100);
    expect(bill).toBeInstanceOf(BillsDto);
    expect(bill.fiveEuro).toBe(5);
    expect(bill.tenEuro).toBe(10);
    expect(bill.twentyEuro).toBe(20);
    expect(bill.fiftyEuro).toBe(50);
    expect(bill.hundredEuro).toBe(100);
  });
});

describe('CreateCashRegisterDto', () => {
  it('should create a CreateCashRegisterDto object', () => {
    const coin = new CoinsDto(1, 2, 3, 4, 5, 6, 7, 8);
    const bill = new BillsDto(5, 10, 20, 50, 100);
    const cashRegister = new CreateCashRegisterDto(
      coin,
      bill,
      200,
      60,
      400,
      1000,
    );
    expect(cashRegister).toBeInstanceOf(CreateCashRegisterDto);

    expect(coin).toBeInstanceOf(CoinsDto);
    expect(coin.oneCent).toBe(1);
    expect(coin.twoCent).toBe(2);
    expect(coin.fiveCent).toBe(3);
    expect(coin.tenCent).toBe(4);
    expect(coin.twentyCent).toBe(5);
    expect(coin.fiftyCent).toBe(6);
    expect(coin.oneEuro).toBe(7);
    expect(coin.twoEuro).toBe(8);

    expect(bill).toBeInstanceOf(BillsDto);
    expect(bill.fiveEuro).toBe(5);
    expect(bill.tenEuro).toBe(10);
    expect(bill.twentyEuro).toBe(20);
    expect(bill.fiftyEuro).toBe(50);
    expect(bill.hundredEuro).toBe(100);

    expect(cashRegister.totalCardPayments).toBe(200);
    expect(cashRegister.totalSpent).toBe(60);
    expect(cashRegister.cashInBox).toBe(400);
    expect(cashRegister.reportedTotal).toBe(1000);
  });
});
