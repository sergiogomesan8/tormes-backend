import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Bills, Coins } from '../../../core/domain/models/cash-register.model';
import { Type } from 'class-transformer';

export class CoinsDto {
  @ApiProperty({
    description: 'One cent coins',
    example: 1,
  })
  @IsNumber()
  oneCent: number;

  @ApiProperty({
    description: 'Two cent coins',
    example: 2,
  })
  @IsNumber()
  twoCent: number;

  @ApiProperty({
    description: 'Five cent coins',
    example: 5,
  })
  @IsNumber()
  fiveCent: number;

  @ApiProperty({
    description: 'Ten cent coins',
    example: 10,
  })
  @IsNumber()
  tenCent: number;

  @ApiProperty({
    description: 'Twenty cent coins',
    example: 20,
  })
  @IsNumber()
  twentyCent: number;

  @ApiProperty({
    description: 'Fifty cent coins',
    example: 50,
  })
  @IsNumber()
  fiftyCent: number;

  @ApiProperty({
    description: 'One euro coins',
    example: 1,
  })
  @IsNumber()
  oneEuro: number;

  @ApiProperty({
    description: 'Two euro coins',
    example: 2,
  })
  @IsNumber()
  twoEuro: number;

  constructor(
    oneCent: number,
    twoCent: number,
    fiveCent: number,
    tenCent: number,
    twentyCent: number,
    fiftyCent: number,
    oneEuro: number,
    twoEuro: number,
  ) {
    this.oneCent = oneCent;
    this.twoCent = twoCent;
    this.fiveCent = fiveCent;
    this.tenCent = tenCent;
    this.twentyCent = twentyCent;
    this.fiftyCent = fiftyCent;
    this.oneEuro = oneEuro;
    this.twoEuro = twoEuro;
  }
}

export class BillsDto {
  @ApiProperty({
    description: 'Five euro bill',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  fiveEuro: number;

  @ApiProperty({
    description: 'Ten euro bill',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  tenEuro: number;

  @ApiProperty({
    description: 'Twenty euro bill',
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  twentyEuro: number;

  @ApiProperty({
    description: 'Fifty euro bill',
    example: 50,
  })
  @IsNotEmpty()
  @IsNumber()
  fiftyEuro: number;

  @ApiProperty({
    description: 'Hundred euro bill',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  hundredEuro: number;

  constructor(
    fiveEuro: number,
    tenEuro: number,
    twentyEuro: number,
    fiftyEuro: number,
    hundredEuro: number,
  ) {
    this.fiveEuro = fiveEuro;
    this.tenEuro = tenEuro;
    this.twentyEuro = twentyEuro;
    this.fiftyEuro = fiftyEuro;
    this.hundredEuro = hundredEuro;
  }
}

export class CashRegisterParams {
  coins: Coins;
  bills: Bills;
  totalCardPayments: number;
  totalSpent: number;
  cashInBox: number;
  reportedTotal: number;
}

export class CreateCashRegisterDto {
  @ApiProperty({
    description: 'Coins',
    type: CoinsDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CoinsDto)
  coins: Coins;

  @ApiProperty({
    description: 'Bills',
    type: BillsDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BillsDto)
  bills: Bills;

  @ApiProperty({
    description: 'Total card payments',
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  totalCardPayments: number;

  @ApiProperty({
    description: 'Total spent',
    example: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  totalSpent: number;

  @ApiProperty({
    description: 'Cash in box',
    example: 400,
  })
  @IsNotEmpty()
  @IsNumber()
  cashInBox: number;

  @ApiProperty({
    description: 'Reported Total',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  reportedTotal: number;

  constructor(params: CashRegisterParams) {
    this.coins = params.coins;
    this.bills = params.bills;
    this.totalCardPayments = params.totalCardPayments;
    this.totalSpent = params.totalSpent;
    this.cashInBox = params.cashInBox;
    this.reportedTotal = params.reportedTotal;
  }
}

export class UpdateCashRegisterDto {
  @ApiProperty({
    description: 'Coins',
    type: CoinsDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CoinsDto)
  @IsOptional()
  coins?: Coins;

  @ApiProperty({
    description: 'Bills',
    type: BillsDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BillsDto)
  @IsOptional()
  bills?: Bills;

  @ApiProperty({
    description: 'Total card payments',
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  totalCardPayments?: number;

  @ApiProperty({
    description: 'Total spent',
    example: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  totalSpent?: number;

  @ApiProperty({
    description: 'Cash in box',
    example: 400,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  cashInBox?: number;

  @ApiProperty({
    description: 'Reported Total',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  reportedTotal?: number;

  constructor(params?: Partial<CashRegisterParams>) {
    if (params) {
      this.coins = params.coins;
      this.bills = params.bills;
      this.totalCardPayments = params.totalCardPayments;
      this.totalSpent = params.totalSpent;
      this.cashInBox = params.cashInBox;
      this.reportedTotal = params.reportedTotal;
    }
  }
}
