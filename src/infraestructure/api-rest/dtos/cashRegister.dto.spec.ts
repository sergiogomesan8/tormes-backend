import { CoinDto, BillDto, CreateCashRegisterDto } from './cashRegister.dto';

describe('CoinDto', () => {
  it('should create a CoinDto object', () => {
    const coin = new CoinDto(1, 2, 3, 4, 5, 6, 7, 8);
    expect(coin).toBeInstanceOf(CoinDto);
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

describe('BillDto', () => {
  it('should create a BillDto object', () => {
    const bill = new BillDto(5, 10, 20, 50, 100);
    expect(bill).toBeInstanceOf(BillDto);
    expect(bill.fiveEuro).toBe(5);
    expect(bill.tenEuro).toBe(10);
    expect(bill.twentyEuro).toBe(20);
    expect(bill.fiftyEuro).toBe(50);
    expect(bill.hundredEuro).toBe(100);
  });
});

describe('CreateCashRegisterDto', () => {
  it('should create a CreateCashRegisterDto object', () => {
    const coin = new CoinDto(1, 2, 3, 4, 5, 6, 7, 8);
    const bill = new BillDto(5, 10, 20, 50, 100);
    const cashRegister = new CreateCashRegisterDto(coin, bill, 200, 60, 400);
    expect(cashRegister).toBeInstanceOf(CreateCashRegisterDto);

    expect(coin).toBeInstanceOf(CoinDto);
    expect(coin.oneCent).toBe(1);
    expect(coin.twoCent).toBe(2);
    expect(coin.fiveCent).toBe(3);
    expect(coin.tenCent).toBe(4);
    expect(coin.twentyCent).toBe(5);
    expect(coin.fiftyCent).toBe(6);
    expect(coin.oneEuro).toBe(7);
    expect(coin.twoEuro).toBe(8);

    expect(bill).toBeInstanceOf(BillDto);
    expect(bill.fiveEuro).toBe(5);
    expect(bill.tenEuro).toBe(10);
    expect(bill.twentyEuro).toBe(20);
    expect(bill.fiftyEuro).toBe(50);
    expect(bill.hundredEuro).toBe(100);
  });
});
