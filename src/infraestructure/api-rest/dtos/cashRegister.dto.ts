import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Bill, Coin } from '../../../core/domain/models/cashRegister.model';
import { Type } from 'class-transformer';

export class CoinDto {
  @ApiProperty({
    description: 'One cent coins',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  oneCent?: number;

  @ApiProperty({
    description: 'Two cent coins',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  twoCent?: number;

  @ApiProperty({
    description: 'Five cent coins',
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  fiveCent?: number;

  @ApiProperty({
    description: 'Ten cent coins',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  tenCent?: number;

  @ApiProperty({
    description: 'Twenty cent coins',
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  twentyCent?: number;

  @ApiProperty({
    description: 'Fifty cent coins',
    example: 50,
  })
  @IsNumber()
  @IsOptional()
  fiftyCent?: number;

  @ApiProperty({
    description: 'One euro coins',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  oneEuro?: number;

  @ApiProperty({
    description: 'Two euro coins',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  twoEuro?: number;

  constructor(
    oneCent?: number,
    twoCent?: number,
    fiveCent?: number,
    tenCent?: number,
    twentyCent?: number,
    fiftyCent?: number,
    oneEuro?: number,
    twoEuro?: number,
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

export class BillDto {
  @ApiProperty({
    description: 'Five euro bill',
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  fiveEuro?: number;

  @ApiProperty({
    description: 'Ten euro bill',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  tenEuro?: number;

  @ApiProperty({
    description: 'Twenty euro bill',
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  twentyEuro?: number;

  @ApiProperty({
    description: 'Fifty euro bill',
    example: 50,
  })
  @IsNumber()
  @IsOptional()
  fiftyEuro?: number;

  @ApiProperty({
    description: 'Hundred euro bill',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  hundredEuro?: number;

  constructor(
    fiveEuro?: number,
    tenEuro?: number,
    twentyEuro?: number,
    fiftyEuro?: number,
    hundredEuro?: number,
  ) {
    this.fiveEuro = fiveEuro;
    this.tenEuro = tenEuro;
    this.twentyEuro = twentyEuro;
    this.fiftyEuro = fiftyEuro;
    this.hundredEuro = hundredEuro;
  }
}

export class CreateCashRegisterDto {
  @ApiProperty({
    description: 'Coins',
    type: CoinDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CoinDto)
  coin: Coin;

  @ApiProperty({
    description: 'Bills',
    type: BillDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BillDto)
  bill: Bill;

  @ApiProperty({
    description: 'Total card payments',
    example: 200,
  })
  @IsNumber()
  @IsOptional()
  totalCardPayments?: number;

  @ApiProperty({
    description: 'Total spent',
    example: 60,
  })
  @IsNumber()
  @IsOptional()
  totalSpent?: number;

  @ApiProperty({
    description: 'Cash in box',
    example: 400,
  })
  @IsNumber()
  @IsOptional()
  cashInBox?: number;
}
